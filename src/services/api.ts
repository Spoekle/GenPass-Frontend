import CryptoJS from 'crypto-js';

const API_URL = import.meta.env.PROD 
  ? 'https://genpass.spoekle.com/api' 
  : 'http://localhost:3001/api';

// Encryption key for secure communication with backend
// In a real production app, this would be loaded from environment variables
const ENCRYPTION_KEY = 'genpass-secure-encryption-key-12345';

// Feature flag for using encryption
const USE_ENCRYPTION = true;

export interface Option {
  option: string;
  weight: number;
}

// Helper function to handle encrypted responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Check if the response is encrypted
  if (data.encrypted && data.data) {
    try {
      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(data.data, ENCRYPTION_KEY);
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data from server');
    }
  }
  
  return data;
};

// Fetch standard options from the backend
export const getStandardOptions = async (): Promise<Option[]> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add encryption header if enabled
    if (USE_ENCRYPTION) {
      headers['X-Accept-Encryption'] = 'enabled';
    }
    
    const response = await fetch(`${API_URL}/password/standard-options`, { headers });
    const data = await handleResponse(response);
    return data.options;
  } catch (error) {
    console.error('Error fetching standard options:', error);
    // Fall back to empty array if API fails
    return [];
  }
};

export const generatePassword = async (
  options: Option[],
  numOptions: number,
  replaceChars: boolean,
  amount: number = 1
): Promise<string> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add encryption header if enabled
    if (USE_ENCRYPTION) {
      headers['X-Accept-Encryption'] = 'enabled';
    }
    
    const response = await fetch(`${API_URL}/password/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        options,
        numOptions,
        replaceChars,
        amount,
      }),
    });
    
    const data = await handleResponse(response);
    return data.password;
  } catch (error) {
    console.error('Error generating password:', error);
    return 'Error generating password. Please try again.';
  }
};

export const generateAdvancedPassword = async (
  useSegments: boolean,
  segmentCount: number,
  passwordLength: number,
  includeNumbers: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean,
  amount: number = 1
): Promise<string> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add encryption header if enabled
    if (USE_ENCRYPTION) {
      headers['X-Accept-Encryption'] = 'enabled';
    }
    
    const response = await fetch(`${API_URL}/password/generate-advanced`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        useSegments,
        segmentCount,
        passwordLength,
        includeNumbers,
        includeSymbols,
        includeUppercase,
        amount,
      }),
    });
    
    const data = await handleResponse(response);
    return data.password;
  } catch (error) {
    console.error('Error generating advanced password:', error);
    return 'Error generating password. Please try again.';
  }
};