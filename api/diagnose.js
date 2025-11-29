import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { symptoms, age, gender, notes } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ error: 'Symptoms are required' });
    }

    try {
        // 1. Initialize Supabase
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if RLS is strict
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Fetch Context Data (Diseases & Symptoms)
        const [diseasesResult, symptomsResult] = await Promise.all([
            supabase.from('diseases').select('*'),
            supabase.from('symptoms').select('*')
        ]);

        if (diseasesResult.error) throw diseasesResult.error;
        if (symptomsResult.error) throw symptomsResult.error;

        const diseases = diseasesResult.data;
        const allSymptoms = symptomsResult.data;

        // 3. Construct Prompt
        // Map symptom IDs to names if needed, or just pass the names directly if frontend sends names.
        // Assuming frontend sends ID or Name. Let's assume frontend sends names or we resolve them.
        // For simplicity, let's assume the frontend sends the resolved names or we map them here.
        // But to be safe, let's map IDs to names if the input is IDs.

        // Let's assume 'symptoms' in body is an array of strings (names).

        const systemPrompt = `
      You are an expert medical diagnostician. Your goal is to diagnose a patient's condition based ONLY on the provided database of diseases.
      
      Here is the database of known diseases:
      ${JSON.stringify(diseases.map(d => ({
            name: d.name,
            symptoms: d.symptoms, // These might be IDs, we should probably resolve them or rely on description
            description: d.description,
            diagnosis_method: d.diagnosis_method
        })))}

      Here is the list of known symptoms with their categories:
      ${JSON.stringify(allSymptoms.map(s => ({ id: s.id, name: s.name, category: s.category })))}

      Patient Profile:
      - Age: ${age}
      - Gender: ${gender}
      - Reported Symptoms: ${symptoms.join(', ')}
      - Additional Notes: ${notes}

      Instructions:
      1. Analyze the patient's symptoms against the disease database.
      2. Identify the most likely diseases.
      3. Return the result in the following JSON format:
      {
        "diagnosis": [
          {
            "disease_name": "Name of the disease",
            "confidence": 0-100,
            "reasoning": "Why this disease matches",
            "suggested_actions": ["Action 1", "Action 2"]
          }
        ],
        "disclaimer": "Standard medical disclaimer..."
      }
      4. If no disease matches well, state that in the reasoning and provide a low confidence score.
      5. DO NOT hallucinate diseases not in the database.
    `;

        // 4. Call OpenAI
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
            model: 'gpt-4o', // or gpt-3.5-turbo
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);

        res.status(200).json(result);

    } catch (error) {
        console.error('Diagnosis error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
