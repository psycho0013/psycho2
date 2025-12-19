const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API: ماسح الأدوية - Medicine Scanner
 * يستخدم OpenAI Vision لقراءة اسم الدواء من الصورة
 * ثم يبحث عنه في قاعدة البيانات
 * ═══════════════════════════════════════════════════════════════════════════
 */

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    console.log('📷 Medicine Scanner API called');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image } = req.body; // Base64 image

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    // Environment validation
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase config');
        return res.status(500).json({ error: 'Server Configuration Error' });
    }

    if (!openaiKey) {
        console.error('❌ Missing OpenAI API Key');
        return res.status(500).json({ error: 'Server Configuration Error' });
    }

    try {
        // ═══════════════════════════════════════════════════════════════
        // Step 1: Extract medicine name using OpenAI Vision
        // ═══════════════════════════════════════════════════════════════
        console.log('🔍 Analyzing image with OpenAI Vision...');

        const openai = new OpenAI({ apiKey: openaiKey });

        const visionResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `أنت خبير صيدلاني. انظر لهذه الصورة لعلبة أو شريط دواء.
استخرج المعلومات التالية فقط:

1. اسم الدواء بالعربي (إن وجد)
2. اسم الدواء بالإنجليزي (إن وجد)
3. التركيز/الجرعة (مثل 500mg)
4. الشكل الدوائي (أقراص، كبسولات، شراب، حقن، إلخ)

أرجع JSON فقط بهذا الشكل:
{
  "name_ar": "الاسم بالعربي أو null",
  "name_en": "الاسم بالإنجليزي أو null",
  "dosage": "التركيز أو null",
  "form": "الشكل الدوائي أو null",
  "found": true/false
}

إذا لم تتمكن من قراءة اسم الدواء، أرجع found: false`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 500
        });

        const visionResult = visionResponse.choices[0].message.content;
        console.log('📝 Vision result:', visionResult);

        // Parse JSON from response
        let extractedData;
        try {
            // Extract JSON from possible markdown code blocks
            const jsonMatch = visionResult.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                extractedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('❌ Failed to parse vision response:', parseError);
            return res.status(200).json({
                success: false,
                error: 'لم نتمكن من قراءة الصورة بوضوح. حاول التقاط صورة أوضح.',
                raw: visionResult
            });
        }

        if (!extractedData.found || (!extractedData.name_ar && !extractedData.name_en)) {
            return res.status(200).json({
                success: false,
                error: 'لم نتمكن من التعرف على اسم الدواء في الصورة.',
                extracted: extractedData
            });
        }

        console.log('✅ Extracted medicine:', extractedData);

        // ═══════════════════════════════════════════════════════════════
        // Step 2: Search for medicine in database
        // ═══════════════════════════════════════════════════════════════
        console.log('🔎 Searching in database...');

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: treatments, error: dbError } = await supabase
            .from('treatments')
            .select('*');

        if (dbError) {
            console.error('❌ Database error:', dbError);
            throw new Error('Database error');
        }

        // Search by name (Arabic or English)
        const searchTerms = [
            extractedData.name_ar?.toLowerCase(),
            extractedData.name_en?.toLowerCase()
        ].filter(Boolean);

        let matchedTreatment = null;
        let matchScore = 0;

        for (const treatment of treatments) {
            const treatmentNameAr = treatment.name?.toLowerCase() || '';
            const treatmentNameEn = treatment.name_en?.toLowerCase() || '';

            for (const term of searchTerms) {
                // Exact match
                if (treatmentNameAr === term || treatmentNameEn === term) {
                    matchedTreatment = treatment;
                    matchScore = 100;
                    break;
                }
                // Partial match
                if (treatmentNameAr.includes(term) || term.includes(treatmentNameAr) ||
                    treatmentNameEn.includes(term) || term.includes(treatmentNameEn)) {
                    if (matchScore < 80) {
                        matchedTreatment = treatment;
                        matchScore = 80;
                    }
                }
            }
            if (matchScore === 100) break;
        }

        // ═══════════════════════════════════════════════════════════════
        // Step 3: Return result
        // ═══════════════════════════════════════════════════════════════
        if (matchedTreatment) {
            console.log('✅ Found treatment:', matchedTreatment.name);
            return res.status(200).json({
                success: true,
                found_in_db: true,
                extracted: extractedData,
                treatment: {
                    id: matchedTreatment.id,
                    name: matchedTreatment.name,
                    name_en: matchedTreatment.name_en,
                    description: matchedTreatment.description,
                    type: matchedTreatment.type,
                    dosage: matchedTreatment.dosage
                },
                match_score: matchScore
            });
        } else {
            console.log('⚠️ Medicine not found in database');
            return res.status(200).json({
                success: true,
                found_in_db: false,
                extracted: extractedData,
                message: 'تم التعرف على الدواء لكنه غير موجود في قاعدة البيانات حالياً.'
            });
        }

    } catch (error) {
        console.error('❌ Scanner error:', error);
        res.status(500).json({
            error: 'حدث خطأ أثناء معالجة الصورة',
            details: error.message
        });
    }
};
