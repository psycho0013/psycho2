const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('🚀 Test API called - Working!');

    res.status(200).json({
        message: 'API is working perfectly!',
        timestamp: new Date().toISOString(),
        method: req.method
    });
};
