const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API: محلل صور الأشعة - X-Ray Analyzer
 * يستخدم Gemini 2.5 Flash لتحليل صور الأشعة الطبية
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

    console.log('🩻 X-Ray Analyzer API called');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image } = req.body; // Base64 image

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    // Environment validation
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
        console.error('❌ Missing Gemini API Key');
        return res.status(500).json({ error: 'Server Configuration Error: Missing GEMINI_API_KEY' });
    }

    try {
        // ═══════════════════════════════════════════════════════════════
        // Initialize Gemini AI
        // ═══════════════════════════════════════════════════════════════
        console.log('🔍 Analyzing X-Ray image with Gemini 2.5 Flash...');

        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Extract base64 data (remove data URL prefix if present)
        let base64Data = image;
        let mimeType = 'image/jpeg';

        if (image.startsWith('data:')) {
            const matches = image.match(/^data:(.+?);base64,(.+)$/);
            if (matches) {
                mimeType = matches[1];
                base64Data = matches[2];
            }
        }

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const prompt = `أنت طبيب أشعة خبير ومتخصص. قم بتحليل صورة الأشعة هذه بدقة عالية.

⚠️ تنبيه مهم: هذا التحليل استرشادي فقط ولا يُغني أبداً عن استشارة طبيب أشعة متخصص.

قم بتحليل الصورة وأرجع النتائج بصيغة JSON التالية فقط (بدون أي نص إضافي):
{
  "image_type": "نوع الأشعة (مثل: أشعة سينية للصدر، أشعة مقطعية للبطن، رنين مغناطيسي للركبة، إلخ)",
  "body_part": "المنطقة التشريحية المصورة",
  "quality": "جودة الصورة: ممتازة / جيدة / متوسطة / ضعيفة",
  "findings": [
    {
      "finding": "وصف الملاحظة",
      "location": "موقعها التشريحي",
      "severity": "خفيف / متوسط / شديد / حرج",
      "confidence": 0-100
    }
  ],
  "normal_structures": ["قائمة بالتراكيب الطبيعية الظاهرة"],
  "abnormalities_detected": true/false,
  "overall_impression": "الانطباع العام والتقييم الشامل للصورة",
  "recommendations": ["التوصيات والإجراءات المقترحة"],
  "urgency": "عادي / متابعة / عاجل / طوارئ",
  "differential_diagnosis": ["التشخيصات التفريقية المحتملة"],
  "disclaimer": "⚠️ هذا التحليل تم بواسطة ذكاء اصطناعي وهو استرشادي فقط. يجب مراجعة طبيب أشعة متخصص للتشخيص النهائي."
}

إذا كانت الصورة ليست صورة أشعة طبية، أرجع:
{
  "error": true,
  "message": "الصورة المرفوعة لا تبدو صورة أشعة طبية. يرجى رفع صورة أشعة سينية أو مقطعية أو رنين مغناطيسي.",
  "disclaimer": "⚠️ هذا التحليل تم بواسطة ذكاء اصطناعي وهو استرشادي فقط."
}`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log('📝 Gemini response received');

        // Parse JSON from response
        let analysisResult;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('❌ Failed to parse Gemini response:', parseError);
            return res.status(200).json({
                success: false,
                error: 'لم نتمكن من تحليل الصورة. حاول رفع صورة أوضح.',
                raw: text
            });
        }

        // Check if it's a valid medical image
        if (analysisResult.error) {
            return res.status(200).json({
                success: false,
                not_medical: true,
                message: analysisResult.message,
                disclaimer: analysisResult.disclaimer
            });
        }

        console.log('✅ X-Ray analysis completed successfully');
        return res.status(200).json({
            success: true,
            analysis: analysisResult
        });

    } catch (error) {
        console.error('❌ X-Ray Analyzer error:', error.message || error);
        console.error('❌ Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        res.status(500).json({
            error: 'حدث خطأ أثناء تحليل الصورة',
            details: error.message || 'Unknown error'
        });
    }
};
