import { useState } from 'react';
import { useSecurity } from '../../contexts/SecurityContext';
import { EncryptionService } from '../../utils/encryption';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Key, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export const KeyManager = () => {
    const { encryptionKey } = useSecurity();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const generateAndSaveKeys = async () => {
        if (!encryptionKey) {
            setStatus('error');
            setMessage('Master Key not available. Please login again.');
            return;
        }

        if (!confirm('WARNING: Generating new keys will render all previously encrypted patient data unreadable. Are you sure?')) {
            return;
        }

        setLoading(true);
        setStatus('idle');

        try {
            // 1. Generate RSA Key Pair
            const keyPair = await EncryptionService.generateKeyPair();

            // 2. Export Public Key (Plaintext)
            const publicKeyJson = await EncryptionService.exportKey(keyPair.publicKey);

            // 3. Export Private Key (Plaintext temporarily)
            const privateKeyJson = await EncryptionService.exportKey(keyPair.privateKey);

            // 4. Encrypt Private Key with Master Key (AES-GCM)
            const encryptedPrivateKey = await EncryptionService.encrypt(privateKeyJson, encryptionKey);

            // 5. Save to Supabase باستخدام Service Role (صلاحيات إدارية)
            const { error } = await supabaseAdmin
                .from('security_keys')
                .upsert({
                    id: 'admin_key_pair',
                    public_key: publicKeyJson,
                    encrypted_private_key: encryptedPrivateKey,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setStatus('success');
            setMessage('Keys generated and saved successfully.');
        } catch (error) {
            console.error('Key generation failed:', error);
            setStatus('error');
            setMessage('Failed to save keys. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Key className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Encryption Key Management</h3>
            </div>

            <p className="text-gray-600 mb-6">
                Manage the cryptographic keys used to secure patient data.
                The Private Key is encrypted with your Master Password before being stored.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-yellow-800">Critical Warning</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                            Rotating keys (generating new ones) will make all existing encrypted patient data permanently unreadable.
                            Only do this when setting up the system for the first time or after a complete data wipe.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={generateAndSaveKeys}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    Generate & Save New Keys
                </button>

                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                        <AlertTriangle className="w-5 h-5" />
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};
