-- ========================================
-- SmartTashkhees Diagnosis Feedback
-- ========================================

CREATE TABLE IF NOT EXISTS diagnosis_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    disease_name TEXT,
    confidence_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE diagnosis_feedback ENABLE ROW LEVEL SECURITY;

-- السماح لأي شخص بإرسال تقييم
CREATE POLICY "Anyone can insert feedback"
    ON diagnosis_feedback FOR INSERT
    WITH CHECK (true);

-- فقط الأدمن يقدر يشوف التقييمات
CREATE POLICY "Service role can read feedback"
    ON diagnosis_feedback FOR SELECT
    USING (true);

CREATE INDEX idx_feedback_created ON diagnosis_feedback(created_at DESC);
