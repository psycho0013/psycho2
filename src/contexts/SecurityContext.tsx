import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { EncryptionService } from '../utils/encryption';
import { supabase } from '../lib/supabase';

interface SecurityContextType {
    isAuthenticated: boolean;
    encryptionKey: CryptoKey | null;
    rsaPrivateKey: CryptoKey | null;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    encrypt: (data: string) => Promise<string>;
    decrypt: (encryptedData: string) => Promise<string | null>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
    const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
    const [rsaPrivateKey, setRsaPrivateKey] = useState<CryptoKey | null>(null);

    const login = useCallback(async (password: string) => {
        try {
            const masterKey = await EncryptionService.deriveKey(password);
            setEncryptionKey(masterKey);

            // Fetch encrypted private key from DB
            const { data, error } = await supabase
                .from('security_keys')
                .select('encrypted_private_key')
                .eq('id', 'admin_key_pair')
                .single();

            if (data && !error) {
                try {
                    const privKeyJson = await EncryptionService.decrypt(data.encrypted_private_key, masterKey);
                    if (privKeyJson) {
                        const privKey = await EncryptionService.importKey(privKeyJson, 'private');
                        setRsaPrivateKey(privKey);
                    }
                } catch (e) {
                    console.error('Failed to decrypt private key:', e);
                    // We don't fail login if key fetch fails, but admin won't be able to decrypt patient data
                }
            }

            return true;
        } catch (error) {
            console.error('Failed to derive key:', error);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setEncryptionKey(null);
        setRsaPrivateKey(null);
    }, []);

    const encrypt = useCallback(async (data: string) => {
        if (!encryptionKey) throw new Error('No encryption key available');
        return EncryptionService.encrypt(data, encryptionKey);
    }, [encryptionKey]);

    const decrypt = useCallback(async (encryptedData: string) => {
        if (!encryptionKey) return null;
        return EncryptionService.decrypt(encryptedData, encryptionKey);
    }, [encryptionKey]);

    return (
        <SecurityContext.Provider
            value={{
                isAuthenticated: !!encryptionKey,
                encryptionKey,
                rsaPrivateKey, // Added to context value
                login,
                logout,
                encrypt,
                decrypt
            }}
        >
            {children}
        </SecurityContext.Provider>
    );
};

export const useSecurity = () => {
    const context = useContext(SecurityContext);
    if (context === undefined) {
        throw new Error('useSecurity must be used within a SecurityProvider');
    }
    return context;
};
