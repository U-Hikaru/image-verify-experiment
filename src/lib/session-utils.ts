import crypto from "crypto";

const algorithm = "AES-CBC";

async function getKey(secret: string) {
  if (!secret) {
    throw new Error("Encryption key is missing in the environment variables");
  }

  const enc = new TextEncoder();
  let keyData = enc.encode(secret);

  // If the key is too short, pad it. If it's too long, truncate it.
  if (keyData.length < 32) {
    keyData = new Uint8Array(32); 
    keyData.set(enc.encode(secret), 0); 
  } else if (keyData.length > 32) {
    keyData = keyData.slice(0, 32);
  }
    
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: algorithm },  // Specify the algorithm
      false, 
      ["encrypt", "decrypt"]
    );
  }

  return crypto.subtle.importKey("raw", keyData, { name: algorithm }, false, ["encrypt", "decrypt"]);
}


// Encrypt Data (Browser-Safe)
export async function encryptSessionData(data: any): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(16)); // 16-byte IV
  const key = await getKey(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  
  const encrypted = await crypto.subtle.encrypt({ name: algorithm, iv }, key, encodedData);
  return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
}

// Decrypt Data (Browser-Safe)
export async function decryptSessionData(encryptedData: string): Promise<any> {
  const [ivBase64, encryptedBase64] = encryptedData.split(":");
  const iv = new Uint8Array(atob(ivBase64).split("").map(c => c.charCodeAt(0)));
  const encrypted = new Uint8Array(atob(encryptedBase64).split("").map(c => c.charCodeAt(0)));
  
    const key = await getKey(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
    
 if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const decrypted = await window.crypto.subtle.decrypt({ name: algorithm, iv }, key, encrypted);
    
    return JSON.parse(new TextDecoder().decode(decrypted));
    } 
    const decrypted = await crypto.subtle.decrypt({ name: algorithm, iv }, key, encrypted);
  
  return JSON.parse(new TextDecoder().decode(decrypted));
}