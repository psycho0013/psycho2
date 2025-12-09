/**
 * Weighted Symptom Matcher
 * 
 * Implements Stage 1 of the Hybrid Diagnosis System.
 * Calculates a weighted score for each disease based on matching symptoms.
 */

import type { Disease } from '@/types/medical';

interface SelectedSymptom {
    id: string;
    severity: 'mild' | 'moderate' | 'severe';
}

interface ScoredDisease {
    disease: Disease;
    score: number;
    matchedSymptoms: string[];
    matchPercentage: number;
}

// Severity multipliers - severe symptoms count more
const SEVERITY_MULTIPLIER: Record<string, number> = {
    mild: 0.6,
    moderate: 1.0,
    severe: 1.5,
};

// Default weight if symptom_weights not defined
const DEFAULT_WEIGHT = 50;

/**
 * Calculate a diagnosis score for each disease based on selected symptoms.
 * 
 * Score Formula:
 * score = Σ(symptom_weight × severity_multiplier) / max_possible_score × 100
 * 
 * @param selectedSymptoms - User's selected symptoms with severity
 * @param diseases - All diseases from database
 * @param relatedSymptoms - Additional related symptoms (severity = moderate)
 * @returns Sorted array of diseases with scores (highest first)
 */
export function calculateDiseaseScores(
    selectedSymptoms: SelectedSymptom[],
    diseases: Disease[],
    relatedSymptoms: string[] = []
): ScoredDisease[] {
    // Combine selected and related symptoms
    const allSymptoms: SelectedSymptom[] = [
        ...selectedSymptoms,
        ...relatedSymptoms.map(id => ({ id, severity: 'moderate' as const }))
    ];

    // Create a lookup map for quick symptom checking
    const symptomMap = new Map<string, number>();
    allSymptoms.forEach(s => {
        const multiplier = SEVERITY_MULTIPLIER[s.severity] || 1.0;
        // If same symptom appears multiple times, use highest multiplier
        const existing = symptomMap.get(s.id) || 0;
        symptomMap.set(s.id, Math.max(existing, multiplier));
    });

    const scoredDiseases: ScoredDisease[] = diseases.map(disease => {
        let score = 0;
        let maxPossibleScore = 0;
        const matchedSymptoms: string[] = [];

        // Calculate score based on disease symptoms
        disease.symptoms.forEach(symptomId => {
            // Get weight from symptom_weights or use default
            const weight = disease.symptom_weights?.[symptomId] ?? DEFAULT_WEIGHT;
            maxPossibleScore += weight;

            // Check if user has this symptom
            const severityMultiplier = symptomMap.get(symptomId);
            if (severityMultiplier !== undefined) {
                score += weight * severityMultiplier;
                matchedSymptoms.push(symptomId);
            }
        });

        // Bonus: Penalize if user has symptoms NOT in this disease (reduces false positives)
        const unmatchedUserSymptoms = allSymptoms.filter(
            s => !disease.symptoms.includes(s.id)
        ).length;
        const penalty = unmatchedUserSymptoms * 5; // Small penalty per unmatched symptom
        score = Math.max(0, score - penalty);

        // Calculate match percentage
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

    // Sort by score (descending), then by match percentage
    return scoredDiseases
        .filter(sd => sd.score > 0) // Only include diseases with some match
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.matchPercentage - a.matchPercentage;
        });
}

/**
 * Get the top N disease candidates for AI analysis.
 * 
 * @param selectedSymptoms - User's selected symptoms
 * @param diseases - All diseases from database
 * @param relatedSymptoms - Additional related symptoms
 * @param topN - Number of candidates to return (default: 7)
 * @returns Top N diseases with their scores
 */
export function getTopCandidates(
    selectedSymptoms: SelectedSymptom[],
    diseases: Disease[],
    relatedSymptoms: string[] = [],
    topN: number = 7
): ScoredDisease[] {
    const scored = calculateDiseaseScores(selectedSymptoms, diseases, relatedSymptoms);
    return scored.slice(0, topN);
}

/**
 * Format candidates for AI prompt (minimal data to reduce tokens).
 */
export function formatCandidatesForAI(candidates: ScoredDisease[]): object[] {
    return candidates.map(c => ({
        name: c.disease.name,
        description: c.disease.description,
        symptoms: c.disease.symptoms,
        matched_symptoms: c.matchedSymptoms,
        preliminary_score: Math.round(c.score),
        diagnosis_method: c.disease.diagnosis_method
    }));
}
