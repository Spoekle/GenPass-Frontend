const API_URL = import.meta.env.PROD 
  ? 'https://genpass.spoekle.com/api' 
  : 'http://localhost:3001/api';

export interface Option {
  option: string;
  weight: number;
}

export const getStandardOptions = async (): Promise<Option[]> => {
  try {
    const response = await fetch(`${API_URL}/password/standard-options`);
    if (!response.ok) {
      throw new Error('Failed to fetch standard options');
    }
    const data = await response.json();
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
    const response = await fetch(`${API_URL}/password/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        options,
        numOptions,
        replaceChars,
        amount,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate password');
    }
    
    const data = await response.json();
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
    const response = await fetch(`${API_URL}/password/generate-advanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    
    if (!response.ok) {
      throw new Error('Failed to generate advanced password');
    }
    
    const data = await response.json();
    return data.password;
  } catch (error) {
    console.error('Error generating advanced password:', error);
    return 'Error generating password. Please try again.';
  }
};