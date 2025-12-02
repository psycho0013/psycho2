/**
 * Encryption Service using Web Crypto API (AES-GCM)
 * 
 * This service handles:
 * 1. Key Derivation (PBKDF2) from a user password.
 * 2. Encryption (AES-GCM) of string data.
 * 3. Decryption (AES-GCM) of string data.
 * 
 * Security Specs:
 * - Algorithm: AES-GCM
 * - Key Length: 256 bits
 * - IV Length: 12 bytes (random per encryption)
 * - Salt Length: 16 bytes (random per key derivation)
 * - Iterations: 100,000 (PBKDF2)
 */

export class EncryptionService {
    private static ALGORITHM = 'AES-GCM';
    private static KEY_LENGTH = 256;
    private static IV_LENGTH = 12;
    private static ITERATIONS = 100000;

    /**
     * Derives a cryptographic key from a password using PBKDF2.
     * Returns the key and the salt used (so it can be stored if needed, 
     * though for this app we might use a fixed salt or per-record salt strategy).
     * 
     * For this specific implementation, we will use a deterministic salt strategy 
     * if we want the SAME password to always generate the SAME key for searching (not recommended for high security)
     * OR we use a random salt and store it.
     * 
     * DECISION: Since we need to decrypt data encrypted by the same password later,
     * we need a consistent way to get the Key.
     * 
     * Approach: The User enters a "Master Password". We derive the Session Key from it.
     * We will use a FIXED application-wide salt for the Master Key derivation to ensure
     * the same password always produces the same Key for this specific application instance.
     * 
     * WARNING: Hardcoding salt reduces security against rainbow tables if the DB is leaked 
     * AND the attacker knows the salt. A better approach is storing a random salt in the DB 
     * associated with the "admin" user, but we are keeping it client-side only for now.
     */
    private static APP_SALT = new TextEncoder().encode('PHY_CMS_SECURE_SALT_v1');

    static async deriveKey(password: string): Promise<CryptoKey> {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            enc.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: this.APP_SALT,
                iterations: this.ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: this.ALGORITHM, length: this.KEY_LENGTH },
            false, // Key is non-extractable
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypts a string value.
     * Returns format: "iv:ciphertext" (Base64 encoded)
     */
    static async encrypt(text: string, key: CryptoKey): Promise<string> {
        const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
        const encoded = new TextEncoder().encode(text);

        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: this.ALGORITHM,
                iv: iv
            },
            key,
            encoded
        );

        const encryptedArray = new Uint8Array(encryptedContent);

        // Combine IV and Ciphertext for storage
        // We'll return them as a JSON string or delimited string
        return JSON.stringify({
            iv: this.arrayBufferToBase64(iv),
            data: this.arrayBufferToBase64(encryptedArray)
        });
    }

    /**
     * Decrypts a string value.
     * Expects format: JSON String { iv: string, data: string }
     */
    static async decrypt(encryptedString: string, key: CryptoKey): Promise<string | null> {
        try {
            const parsed = JSON.parse(encryptedString);
            if (!parsed.iv || !parsed.data) throw new Error('Invalid encrypted format');

            const iv = this.base64ToArrayBuffer(parsed.iv);
            const data = this.base64ToArrayBuffer(parsed.data);

            const decryptedContent = await window.crypto.subtle.decrypt(
                {
                    name: this.ALGORITHM,
                    iv: iv
                },
                key,
                data
            );

            return new TextDecoder().decode(decryptedContent);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null; // Return null if decryption fails (wrong key or corrupted data)
        }
    }

    // --- Asymmetric Encryption (RSA-OAEP) ---

    static async generateKeyPair(): Promise<CryptoKeyPair> {
        return window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    static async exportKey(key: CryptoKey): Promise<string> {
        const exported = await window.crypto.subtle.exportKey('jwk', key);
        return JSON.stringify(exported);
    }

    static async importKey(jwkString: string, type: 'public' | 'private'): Promise<CryptoKey> {
        const jwk = JSON.parse(jwkString);
        return window.crypto.subtle.importKey(
            'jwk',
            jwk,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            true,
            [type === 'public' ? 'encrypt' : 'decrypt']
        );
    }

    static async encryptAsymmetric(data: string, publicKey: CryptoKey): Promise<string> {
        const encoded = new TextEncoder().encode(data);
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            publicKey,
            encoded
        );
        return this.arrayBufferToBase64(encrypted);
    }

    static async decryptAsymmetric(encryptedData: string, privateKey: CryptoKey): Promise<string> {
        const data = this.base64ToArrayBuffer(encryptedData);
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'RSA-OAEP'
            },
            privateKey,
            data
        );
        return new TextDecoder().decode(decrypted);
    }

    // Helper: ArrayBuffer to Base64
    private static arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // Helper: Base64 to ArrayBuffer
    private static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
