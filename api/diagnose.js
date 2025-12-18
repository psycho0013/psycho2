const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai').default;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * نظام التشخيص الذكي المحسّن - ENHANCED HYBRID DIAGNOSIS API
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * التحسينات:
 * 1. تحليل عميق للمعلومات الشخصية (العمر، الجنس، BMI)
 * 2. دمج الأمراض المزمنة في التشخيص
 * 3. تحليل ذكي لشدة الأعراض
 * 4. Semantic Matching للأعراض المتشابهة
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Severity multipliers for weighted matching
const SEVERITY_MULTIPLIER = {
  mild: 0.6,
  moderate: 1.0,
  severe: 1.5,
};

const DEFAULT_WEIGHT = 50;

/**
 * حساب مؤشر كتلة الجسم (BMI) وتصنيفه
 */
function calculateBMI(weight, height) {
  if (!weight || !height) return { bmi: null, category: 'غير محدد', categoryEn: 'Unknown' };

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category, categoryEn;
  if (bmi < 18.5) {
    category = 'نقص الوزن';
    categoryEn = 'Underweight';
  } else if (bmi < 25) {
    category = 'وزن طبيعي';
    categoryEn = 'Normal';
  } else if (bmi < 30) {
    category = 'زيادة الوزن';
    categoryEn = 'Overweight';
  } else if (bmi < 35) {
    category = 'سمنة درجة أولى';
    categoryEn = 'Obesity Class I';
  } else if (bmi < 40) {
    category = 'سمنة درجة ثانية';
    categoryEn = 'Obesity Class II';
  } else {
    category = 'سمنة مفرطة';
    categoryEn = 'Severe Obesity';
  }

  return { bmi: Math.round(bmi * 10) / 10, category, categoryEn };
}

/**
 * تحديد الفئة العمرية وعوامل الخطر المرتبطة
 */
function getAgeAnalysis(age) {
  const ageNum = parseInt(age);
  if (!ageNum) return { group: 'Unknown', risks: [], considerations: [] };

  if (ageNum < 2) {
    return {
      group: 'Infant',
      groupAr: 'رضيع',
      risks: ['Higher susceptibility to infections', 'Dehydration risk', 'Fever is more serious'],
      risksAr: ['قابلية أعلى للعدوى', 'خطر الجفاف', 'الحمى أكثر خطورة'],
      considerations: ['Consider pediatric-specific conditions', 'Dosage must be weight-based', 'Lower threshold for emergency']
    };
  } else if (ageNum < 12) {
    return {
      group: 'Child',
      groupAr: 'طفل',
      risks: ['Pediatric infections', 'Growing pains', 'School-related stress'],
      risksAr: ['عدوى الأطفال', 'آلام النمو', 'ضغوط الدراسة'],
      considerations: ['Consider childhood-specific diseases', 'Growth and development factors']
    };
  } else if (ageNum < 18) {
    return {
      group: 'Adolescent',
      groupAr: 'مراهق',
      risks: ['Hormonal changes', 'Mental health considerations', 'Sports injuries'],
      risksAr: ['تغيرات هرمونية', 'اعتبارات الصحة النفسية', 'إصابات رياضية'],
      considerations: ['Consider puberty-related changes', 'Mental health screening important']
    };
  } else if (ageNum < 40) {
    return {
      group: 'Young Adult',
      groupAr: 'بالغ شاب',
      risks: ['Lifestyle diseases starting', 'Work-related stress', 'Reproductive health'],
      risksAr: ['بداية أمراض نمط الحياة', 'ضغوط العمل', 'صحة الإنجاب'],
      considerations: ['Generally healthy age group', 'Prevention focus']
    };
  } else if (ageNum < 60) {
    return {
      group: 'Middle-aged Adult',
      groupAr: 'بالغ متوسط العمر',
      risks: ['Cardiovascular disease risk increases', 'Metabolic syndrome', 'Cancer screening important'],
      risksAr: ['زيادة خطر أمراض القلب', 'متلازمة الأيض', 'أهمية فحص السرطان'],
      considerations: ['Screen for chronic diseases', 'Preventive care crucial', 'Consider family history']
    };
  } else {
    return {
      group: 'Elderly',
      groupAr: 'كبير السن',
      risks: ['Multiple chronic conditions common', 'Drug interactions', 'Cognitive decline', 'Falls risk'],
      risksAr: ['شيوع الأمراض المزمنة المتعددة', 'تفاعلات الأدوية', 'تراجع الإدراك', 'خطر السقوط'],
      considerations: ['Consider polypharmacy', 'Atypical presentations common', 'Lower physiological reserve', 'Consider geriatric syndromes']
    };
  }
}

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

/**
 * بناء System Prompt الطبي المتقدم
 */
function buildEnhancedSystemPrompt(data) {
  const {
    candidatesForAI,
    symptomNames,
    symptomDetailsWithSeverity,
    relatedSymptomNames,
    patientInfo,
    bmiData,
    ageAnalysis,
    chronicCorrelations,
    severityRules
  } = data;

  // تحليل الأعراض مع الشدة
  const symptomsWithSeverityAnalysis = symptomDetailsWithSeverity.map(s => {
    const severity = s.severity || 'moderate';
    const severityAr = severity === 'mild' ? 'خفيف' : severity === 'moderate' ? 'متوسط' : 'شديد';

    // البحث عن قواعد الشدة
    const rule = severityRules.find(r =>
      r.symptom_name.toLowerCase() === s.name?.toLowerCase() ||
      r.symptom_name_ar === s.name
    );

    let urgencyNote = '';
    if (rule && rule.severity_level === severity) {
      urgencyNote = `⚠️ URGENCY: ${rule.urgency_level} - ${rule.recommended_action_ar || rule.recommended_action}`;
    } else if (severity === 'severe') {
      urgencyNote = '⚠️ HIGH SEVERITY - Requires careful evaluation';
    }

    return `  • ${s.name}: ${severityAr} (${severity}) ${urgencyNote}`;
  }).join('\n');

  // تحليل الأمراض المزمنة
  let chronicAnalysis = 'لا توجد أمراض مزمنة مُبلغ عنها';
  if (patientInfo.chronicDiseases && patientInfo.chronicDiseases.length > 0) {
    chronicAnalysis = patientInfo.chronicDiseases.map(disease => {
      const correlation = chronicCorrelations.find(c =>
        c.chronic_disease === disease.toLowerCase() ||
        c.chronic_disease_ar === disease
      );

      if (correlation) {
        return `  • ${disease}:
      - المضاعفات المحتملة: ${correlation.related_conditions_ar?.join('، ') || correlation.related_conditions?.join(', ')}
      - أعراض يجب مراقبتها: ${correlation.symptoms_to_watch_ar?.join('، ') || correlation.symptoms_to_watch?.join(', ')}
      - عامل زيادة الخطر: ${correlation.risk_increase_factor}x`;
      }
      return `  • ${disease}: يجب أخذه بعين الاعتبار في التشخيص`;
    }).join('\n');
  }

  return `
أنت طبيب خبير متخصص في التشخيص. ستحلل أعراض المريض وتقارنها مع قائمة الأمراض المُرشحة.

═══════════════════════════════════════════════════════════════════════════
📋 معلومات المريض الحرجة (يجب أن تؤثر على التشخيص):
═══════════════════════════════════════════════════════════════════════════

👤 البيانات الديموغرافية:
  • العمر: ${patientInfo.age} سنة → الفئة: ${ageAnalysis.groupAr} (${ageAnalysis.group})
  • الجنس: ${patientInfo.gender === 'Male' ? 'ذكر' : 'أنثى'}
  ${patientInfo.isPregnant ? '  • 🤰 حامل - تجنب الأدوية الخطرة على الحمل!' : ''}
  ${patientInfo.isBreastfeeding ? '  • 🤱 مُرضعة - تجنب الأدوية التي تمر للحليب!' : ''}

📊 قياسات الجسم:
  • الوزن: ${patientInfo.weight || 'غير محدد'} كغ
  • الطول: ${patientInfo.height || 'غير محدد'} سم
  • مؤشر كتلة الجسم (BMI): ${bmiData.bmi || 'غير محدد'} → ${bmiData.category}
  ${bmiData.bmi > 30 ? '  ⚠️ السمنة تزيد خطر: أمراض القلب، السكري، ارتفاع الضغط' : ''}
  ${bmiData.bmi < 18.5 ? '  ⚠️ نقص الوزن قد يشير إلى: سوء تغذية، أمراض مزمنة' : ''}

👴 عوامل الخطر المرتبطة بالعمر:
${ageAnalysis.risksAr?.map(r => `  • ${r}`).join('\n') || '  • لا توجد عوامل خطر خاصة'}

═══════════════════════════════════════════════════════════════════════════
⚠️ الأمراض المزمنة (حرج - يجب مراعاتها في التشخيص):
═══════════════════════════════════════════════════════════════════════════
${chronicAnalysis}

═══════════════════════════════════════════════════════════════════════════
🔥 تحليل الأعراض مع الشدة:
═══════════════════════════════════════════════════════════════════════════
الأعراض الرئيسية:
${symptomsWithSeverityAnalysis}

الأعراض المرتبطة: ${relatedSymptomNames.length > 0 ? relatedSymptomNames.join('، ') : 'لا توجد'}

═══════════════════════════════════════════════════════════════════════════
🏥 الأمراض المُرشحة (من التصفية الأولية):
═══════════════════════════════════════════════════════════════════════════
${JSON.stringify(candidatesForAI, null, 2)}

═══════════════════════════════════════════════════════════════════════════
📝 تعليمات التشخيص:
═══════════════════════════════════════════════════════════════════════════

1. حلل المرشحين وصنفهم من الأكثر احتمالاً للأقل.

2. ⚡ قواعد حرجة:
   - الأعراض الشديدة (severe) لها أولوية في التشخيص
   - العمر يُغير احتمالية الأمراض بشكل كبير
   - الأمراض المزمنة قد تسبب مضاعفات يجب اعتبارها أولاً
   - الحمل والرضاعة يستبعدان بعض الأدوية

3. 🎯 معايير الثقة:
   - 80-100%: الأعراض تتطابق بشكل ممتاز + عوامل الخطر متوافقة
   - 60-79%: تطابق جيد مع بعض الأعراض الناقصة
   - 40-59%: تطابق متوسط، تحتاج فحوصات إضافية
   - <40%: تطابق ضعيف

4. أعد الرد بهذا الFormat JSON:
{
  "diagnosis": [
    {
      "disease_name": "اسم المرض بالضبط من القائمة",
      "confidence": 0-100,
      "reasoning": "سبب اختيار هذا المرض بناءً على الأعراض والعوامل المذكورة",
      "key_matching_symptoms": ["العرض 1", "العرض 2"],
      "age_gender_relevance": "كيف أثر العمر/الجنس على هذا التشخيص",
      "chronic_disease_impact": "تأثير الأمراض المزمنة إن وجدت",
      "severity_assessment": "تقييم خطورة الحالة: منخفضة/متوسطة/عالية/طوارئ",
      "suggested_actions": ["الإجراء 1", "الإجراء 2"]
    }
  ],
  "emergency_alert": true/false,
  "emergency_reason": "سبب التنبيه الطارئ إن وجد",
  "additional_tests_needed": ["فحص 1", "فحص 2"],
  "disclaimer": "هذا تشخيص أولي فقط ولا يُغني عن استشارة الطبيب المختص."
}

5. أدرج حتى 3 تشخيصات الأكثر احتمالاً.
6. استخدم اسم المرض بالضبط من قائمة المرشحين.
7. إذا كانت أي أعراض شديدة + حرجة (مثل ألم صدر شديد) → اجعل emergency_alert = true
8. اكتب باللغة العربية.
`;
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

  console.log('🚀 ENHANCED HYBRID Diagnose API called');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    symptoms,
    symptomDetails,
    relatedSymptoms,
    age,
    gender,
    weight,
    height,
    chronicDiseases,
    isPregnant,
    isBreastfeeding,
    notes
  } = req.body;

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

    // Fetch all required data in parallel
    console.log('📊 Fetching data...');
    const [diseasesResult, symptomsResult, chronicCorrelationsResult, severityRulesResult] = await Promise.all([
      supabase.from('diseases').select('*'),
      supabase.from('symptoms').select('*'),
      supabase.from('chronic_disease_correlations').select('*'),
      supabase.from('symptom_severity_rules').select('*')
    ]);

    if (diseasesResult.error) throw new Error('Failed to fetch diseases: ' + diseasesResult.error.message);
    if (symptomsResult.error) throw new Error('Failed to fetch symptoms: ' + symptomsResult.error.message);

    const diseases = diseasesResult.data;
    const allSymptomsDB = symptomsResult.data;
    const chronicCorrelations = chronicCorrelationsResult.data || [];
    const severityRules = severityRulesResult.data || [];

    console.log(`✅ Fetched ${diseases.length} diseases, ${allSymptomsDB.length} symptoms, ${chronicCorrelations.length} chronic correlations, ${severityRules.length} severity rules`);

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
    // STAGE 2: AI Analysis with Enhanced Context
    // ═══════════════════════════════════════════════════════════════
    console.log('🤖 STAGE 2: Sending candidates to GPT-4o with enhanced context...');

    // Calculate BMI
    const bmiData = calculateBMI(parseFloat(weight), parseFloat(height));

    // Get age analysis
    const ageAnalysis = getAgeAnalysis(age);

    // Map symptom IDs to names with severity
    const symptomDetailsWithSeverity = (symptomDetails || []).map(s => {
      const sym = allSymptomsDB.find(x => x.id === s.id);
      return {
        id: s.id,
        name: sym?.name_ar || sym?.name || s.id,
        severity: s.severity || 'moderate'
      };
    });

    const relatedSymptomNames = (relatedSymptoms || []).map(id => {
      const sym = allSymptomsDB.find(s => s.id === id);
      return sym?.name_ar || sym?.name || id;
    });

    // Prepare minimal candidate data for AI
    const candidatesForAI = topCandidates.map(c => ({
      name: c.disease.name,
      description: c.disease.description,
      symptoms: c.disease.symptoms.map(id => {
        const sym = allSymptomsDB.find(s => s.id === id);
        return sym?.name_ar || sym?.name || id;
      }),
      matched_symptoms: c.matchedSymptoms.map(id => {
        const sym = allSymptomsDB.find(s => s.id === id);
        return sym?.name_ar || sym?.name || id;
      }),
      preliminary_score: Math.round(c.score),
      diagnosis_method: c.disease.diagnosis_method
    }));

    // Build enhanced system prompt
    const systemPrompt = buildEnhancedSystemPrompt({
      candidatesForAI,
      symptomNames: symptoms,
      symptomDetailsWithSeverity,
      relatedSymptomNames,
      patientInfo: {
        age,
        gender,
        weight,
        height,
        chronicDiseases: chronicDiseases || [],
        isPregnant: isPregnant || false,
        isBreastfeeding: isBreastfeeding || false
      },
      bmiData,
      ageAnalysis,
      chronicCorrelations,
      severityRules
    });

    console.log('📝 Enhanced prompt built with patient context');

    const openai = new OpenAI({ apiKey: openaiKey });
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }],
      model: 'gpt-4o',
      response_format: { type: "json_object" },
    });

    console.log('✅ GPT-4o response received');
    const result = JSON.parse(completion.choices[0].message.content);

    // Attach Stage 1 results and patient context for transparency
    result.stage1_results = topCandidates.map(c => ({
      name: c.disease.name,
      preliminary_score: Math.round(c.score),
      match_percentage: Math.round(c.matchPercentage)
    }));

    result.patient_context = {
      age_group: ageAnalysis.groupAr,
      bmi: bmiData.bmi,
      bmi_category: bmiData.category,
      chronic_diseases_considered: chronicDiseases || []
    };

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
