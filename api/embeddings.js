const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai').default;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Semantic Symptom Matching API using OpenAI Embeddings
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * يستخدم OpenAI text-embedding-3-small لمطابقة الأعراض المتشابهة دلالياً
 * مثل: "صداع" = "ألم الرأس" = "headache"
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * حساب التشابه بين vectorين (Cosine Similarity)
 */
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * الحصول على embedding لنص معين
 */
async function getEmbedding(openai, text) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return response.data[0].embedding;
}

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!openaiKey) {
        return res.status(500).json({ error: 'Missing OpenAI API Key' });
    }

    const openai = new OpenAI({ apiKey: openaiKey });
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ═══════════════════════════════════════════════════════════════
    // GET: Find similar symptoms
    // ═══════════════════════════════════════════════════════════════
    if (req.method === 'GET') {
        const { query, threshold = 0.75 } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        try {
            console.log(`🔍 Finding symptoms similar to: "${query}"`);

            // Get embedding for query
            const queryEmbedding = await getEmbedding(openai, query);

            // Fetch all symptoms from database
            const { data: symptoms, error } = await supabase
                .from('symptoms')
                .select('id, name, name_ar, name_en, category');

            if (error) throw error;

            // Calculate similarity for each symptom
            const results = [];

            for (const symptom of symptoms) {
                // Create combined text for symptom
                const symptomText = `${symptom.name_ar} ${symptom.name_en || ''} ${symptom.name || ''}`.trim();
                const symptomEmbedding = await getEmbedding(openai, symptomText);
                const similarity = cosineSimilarity(queryEmbedding, symptomEmbedding);

                if (similarity >= parseFloat(threshold)) {
                    results.push({
                        id: symptom.id,
                        name: symptom.name,
                        name_ar: symptom.name_ar,
                        name_en: symptom.name_en,
                        category: symptom.category,
                        similarity: Math.round(similarity * 100)
                    });
                }
            }

            // Sort by similarity
            results.sort((a, b) => b.similarity - a.similarity);

            console.log(`✅ Found ${results.length} similar symptoms`);

            return res.status(200).json({
                query,
                threshold: parseFloat(threshold),
                matches: results.slice(0, 10) // Top 10
            });

        } catch (error) {
            console.error('❌ Error finding similar symptoms:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // POST: Generate embeddings for symptoms (batch)
    // ═══════════════════════════════════════════════════════════════
    if (req.method === 'POST') {
        const { action, symptomIds } = req.body;

        if (action === 'generate-embeddings') {
            try {
                console.log('🚀 Generating embeddings for symptoms...');

                // Fetch symptoms to embed
                let query = supabase.from('symptoms').select('id, name, name_ar, name_en');

                if (symptomIds && symptomIds.length > 0) {
                    query = query.in('id', symptomIds);
                }

                const { data: symptoms, error } = await query;
                if (error) throw error;

                console.log(`📊 Processing ${symptoms.length} symptoms...`);

                const results = [];
                for (const symptom of symptoms) {
                    const text = `${symptom.name_ar} ${symptom.name_en || ''} ${symptom.name || ''}`.trim();
                    const embedding = await getEmbedding(openai, text);

                    // Note: Storing embeddings requires pgvector extension in Supabase
                    // For now, we just return the embeddings
                    results.push({
                        id: symptom.id,
                        name_ar: symptom.name_ar,
                        embedding_length: embedding.length
                    });
                }

                console.log(`✅ Generated embeddings for ${results.length} symptoms`);

                return res.status(200).json({
                    message: `Generated embeddings for ${results.length} symptoms`,
                    results
                });

            } catch (error) {
                console.error('❌ Error generating embeddings:', error);
                return res.status(500).json({ error: error.message });
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // POST: Match input symptoms to database symptoms
        // ═══════════════════════════════════════════════════════════════
        if (action === 'match-symptoms') {
            const { inputSymptoms, threshold = 0.8 } = req.body;

            if (!inputSymptoms || !Array.isArray(inputSymptoms)) {
                return res.status(400).json({ error: 'inputSymptoms array required' });
            }

            try {
                console.log(`🔍 Matching ${inputSymptoms.length} input symptoms...`);

                // Fetch all symptoms from database
                const { data: dbSymptoms, error } = await supabase
                    .from('symptoms')
                    .select('id, name, name_ar, name_en, category');

                if (error) throw error;

                // Pre-compute embeddings for all DB symptoms
                const dbSymptomEmbeddings = new Map();
                for (const sym of dbSymptoms) {
                    const text = `${sym.name_ar} ${sym.name_en || ''} ${sym.name || ''}`.trim();
                    dbSymptomEmbeddings.set(sym.id, {
                        symptom: sym,
                        embedding: await getEmbedding(openai, text)
                    });
                }

                // Match each input symptom
                const matches = [];
                for (const inputSymptom of inputSymptoms) {
                    const inputEmbedding = await getEmbedding(openai, inputSymptom);

                    let bestMatch = null;
                    let bestSimilarity = 0;

                    for (const [id, { symptom, embedding }] of dbSymptomEmbeddings) {
                        const similarity = cosineSimilarity(inputEmbedding, embedding);
                        if (similarity > bestSimilarity) {
                            bestSimilarity = similarity;
                            bestMatch = symptom;
                        }
                    }

                    matches.push({
                        input: inputSymptom,
                        matched: bestMatch,
                        similarity: Math.round(bestSimilarity * 100),
                        isMatch: bestSimilarity >= parseFloat(threshold)
                    });
                }

                console.log(`✅ Matched ${matches.filter(m => m.isMatch).length}/${inputSymptoms.length} symptoms`);

                return res.status(200).json({
                    threshold: parseFloat(threshold),
                    matches
                });

            } catch (error) {
                console.error('❌ Error matching symptoms:', error);
                return res.status(500).json({ error: error.message });
            }
        }

        return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
