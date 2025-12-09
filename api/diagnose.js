const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai').default;

/**
 * HYBRID DIAGNOSIS API
 * 
 * Stage 1: Local weighted symptom matching to find top 7 candidates
 * Stage 2: Send only candidates to GPT-4o for final analysis
 * 
 * Benefits: 90% cost reduction, faster response, more accurate
 */

// Severity multipliers for weighted matching
const SEVERITY_MULTIPLIER = {
  mild: 0.6,
  moderate: 1.0,
  severe: 1.5,
};

const DEFAULT_WEIGHT = 50;

/**
 * Stage 1: Calculate disease scores based on symptom matching
 */
function calculateDiseaseScores(selectedSymptoms, diseases, relatedSymptoms = []) {
  // Combine all symptoms
  const allSymptoms = [
    ...selectedSymptoms,
    ...relatedSymptoms.map(id => ({ id, severity: 'moderate' }))
  ];

  // Build symptom lookup map
  const symptomMap = new Map();
  allSymptoms.forEach(s => {
    const multiplier = SEVERITY_MULTIPLIER[s.severity] || 1.0;
    const existing = symptomMap.get(s.id) || 0;
    symptomMap.set(s.id, Math.max(existing, multiplier));
  });

  const scoredDiseases = diseases.map(disease => {
    let score = 0;
    let maxPossibleScore = 0;
    const matchedSymptoms = [];

    disease.symptoms.forEach(symptomId => {
      const weight = disease.symptom_weights?.[symptomId] ?? DEFAULT_WEIGHT;
      maxPossibleScore += weight;

      const severityMultiplier = symptomMap.get(symptomId);
      if (severityMultiplier !== undefined) {
        score += weight * severityMultiplier;
        matchedSymptoms.push(symptomId);
      }
    });

    // Penalty for unmatched user symptoms
    const unmatchedCount = allSymptoms.filter(
      s => !disease.symptoms.includes(s.id)
    ).length;
    score = Math.max(0, score - unmatchedCount * 5);

    const matchPercentage = disease.symptoms.length > 0
      ? (matchedSymptoms.length / disease.symptoms.length) * 100
      : 0;

    return {
      disease,
      score: maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0,
      matchedSymptoms,
      matchPercentage
    };
  });

  return scoredDiseases
    .filter(sd => sd.score > 0)
    .sort((a, b) => b.score - a.score || b.matchPercentage - a.matchPercentage);
}

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

  console.log('🚀 HYBRID Diagnose API called');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symptoms, symptomDetails, relatedSymptoms, age, gender, notes } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  // Environment validation
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase config');
    return res.status(500).json({ error: 'Server Configuration Error', details: 'Missing Supabase' });
  }

  if (!openaiKey) {
    console.error('❌ Missing OpenAI API Key');
    return res.status(500).json({ error: 'Server Configuration Error', details: 'Missing OpenAI' });
  }

  try {
    console.log('🔌 Initializing Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch diseases and symptoms
    console.log('📊 Fetching data...');
    const [diseasesResult, symptomsResult] = await Promise.all([
      supabase.from('diseases').select('*'),
      supabase.from('symptoms').select('*')
    ]);

    if (diseasesResult.error) throw new Error('Failed to fetch diseases: ' + diseasesResult.error.message);
    if (symptomsResult.error) throw new Error('Failed to fetch symptoms: ' + symptomsResult.error.message);

    const diseases = diseasesResult.data;
    const allSymptomsDB = symptomsResult.data;
    console.log(`✅ Fetched ${diseases.length} diseases, ${allSymptomsDB.length} symptoms`);

    // Build symptom details array from input (with severity)
    const selectedSymptoms = symptomDetails || symptoms.map(name => {
      const sym = allSymptomsDB.find(s => s.name === name || s.name_ar === name || s.name_en === name);
      return { id: sym?.id || name, severity: 'moderate' };
    });

    // ═══════════════════════════════════════════════════════════════
    // STAGE 1: Local Weighted Matching
    // ═══════════════════════════════════════════════════════════════
    console.log('🧮 STAGE 1: Running weighted symptom matching...');
    const scoredDiseases = calculateDiseaseScores(selectedSymptoms, diseases, relatedSymptoms || []);
    const topCandidates = scoredDiseases.slice(0, 7);

    console.log(`📊 Top candidates (${topCandidates.length}):`);
    topCandidates.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.disease.name} (score: ${c.score.toFixed(1)}, matched: ${c.matchedSymptoms.length}/${c.disease.symptoms.length})`);
    });

    if (topCandidates.length === 0) {
      console.log('⚠️ No matching diseases found in Stage 1');
      return res.status(200).json({
        diagnosis: [],
        stage1_results: [],
        disclaimer: 'لم يتم العثور على تطابق مع الأعراض المُدخلة في قاعدة البيانات الحالية.'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // STAGE 2: AI Analysis (Only Top Candidates)
    // ═══════════════════════════════════════════════════════════════
    console.log('🤖 STAGE 2: Sending candidates to GPT-4o...');

    // Map symptom IDs to names for AI
    const symptomNames = symptoms; // Already names from frontend
    const relatedSymptomNames = (relatedSymptoms || []).map(id => {
      const sym = allSymptomsDB.find(s => s.id === id);
      return sym?.name || id;
    });

    // Prepare minimal candidate data for AI
    const candidatesForAI = topCandidates.map(c => ({
      name: c.disease.name,
      description: c.disease.description,
      symptoms: c.disease.symptoms.map(id => {
        const sym = allSymptomsDB.find(s => s.id === id);
        return sym?.name || id;
      }),
      matched_symptoms: c.matchedSymptoms.map(id => {
        const sym = allSymptomsDB.find(s => s.id === id);
        return sym?.name || id;
      }),
      preliminary_score: Math.round(c.score),
      diagnosis_method: c.disease.diagnosis_method
    }));

    const systemPrompt = `
You are an expert medical diagnostician. You will analyze a patient's symptoms against a PRE-FILTERED list of candidate diseases (already narrowed down by preliminary matching).

CANDIDATE DISEASES (Top ${candidatesForAI.length} from preliminary matching):
${JSON.stringify(candidatesForAI, null, 2)}

PATIENT INFORMATION:
- Age: ${age}
- Gender: ${gender}
- Reported Symptoms: ${symptomNames.join(', ')}
- Related Symptoms: ${relatedSymptomNames.join(', ') || 'None'}
- Additional Notes: ${notes || 'None'}
- Symptom Severity Details: ${JSON.stringify(selectedSymptoms)}

INSTRUCTIONS:
1. Analyze these candidates and RANK them from most likely to least likely.
2. Consider the preliminary_score as a starting point, but use your medical knowledge to refine.
3. Consider symptom severity (severe symptoms are more indicative).
4. Return your analysis in this JSON format:
{
  "diagnosis": [
    {
      "disease_name": "Exact name from candidates",
      "confidence": 0-100,
      "reasoning": "Why this disease matches (Arabic)",
      "suggested_actions": ["Action 1", "Action 2"]
    }
  ],
  "disclaimer": "إخلاء مسؤولية طبي قياسي"
}
5. Include up to 3 most likely diagnoses.
6. If none of the candidates match well, explain why and give low confidence.
7. Use the EXACT disease name from the candidates list.
8. Respond in Arabic for reasoning and actions.
`;

    const openai = new OpenAI({ apiKey: openaiKey });
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }],
      model: 'gpt-4o',
      response_format: { type: "json_object" },
    });

    console.log('✅ GPT-4o response received');
    const result = JSON.parse(completion.choices[0].message.content);

    // Attach Stage 1 results for transparency
    result.stage1_results = topCandidates.map(c => ({
      name: c.disease.name,
      preliminary_score: Math.round(c.score),
      match_percentage: Math.round(c.matchPercentage)
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Diagnosis error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
