import * as standardOptions from './options/StandardOptions';

export interface Option {
    option: string;
    weight: number;
}

export const getCustomOptions = (): Option[] => {
    const savedOptions = localStorage.getItem('passwordOptions');
    return savedOptions ? JSON.parse(savedOptions) : [];
};

export const getStandardOptions = (): Option[] => {
    return standardOptions.standardOptions as Option[];
};

// Generic shuffle function for any type of array (including Option[])
export const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const charReplacementMap: { [key: string]: string } = {
    'E': '3',
    'a': '@',
    'S': '$',
    'o': '0',
    'i': '!',
    'B': '8',
    'l': '1',
    't': '+',
    's': '$'
};

const replaceCharacters = (str: string): string => {
    return str
        .split('')
        .map(char => {
            if (charReplacementMap[char.toLowerCase()] && Math.random() < 0.3) {
                return charReplacementMap[char.toLowerCase()];
            }
            return char;
        })
        .join('');
};

export const generatePassword = (
    options: Option[],
    numOptions: number,
    replaceChars: boolean,
    amount: number = 1
): string => {
    const results: string[] = [];

    for (let a = 0; a < amount; a++) {
        if (options.length === 0) {
            results.push('');
        } else {
            // Create a copy to perform weighted selection without replacement.
            const availableOptions = [...options];
            const selectedParts: string[] = [];

            for (let i = 0; i < numOptions && availableOptions.length > 0; i++) {
                const totalWeight = availableOptions.reduce((sum, opt) => sum + opt.weight, 0);
                let threshold = Math.random() * totalWeight;
                let selectedIndex = 0;
                for (let j = 0; j < availableOptions.length; j++) {
                    threshold -= availableOptions[j].weight;
                    if (threshold <= 0) {
                        selectedIndex = j;
                        break;
                    }
                }
                const { option } = availableOptions.splice(selectedIndex, 1)[0];
                if (i === 0) {
                    selectedParts.push(option);
                } else {
                    selectedParts.push(option.charAt(0).toUpperCase() + option.slice(1));
                }
            }

            let password = selectedParts.join('');
            if (replaceChars) {
                password = replaceCharacters(password);
            }
            const randomNumbers = Math.floor(Math.random() * 90 + 10);
            password += randomNumbers.toString();
            results.push(password);
        }
    }

    return results.join("\n");
};

export const generateAdvancedPassword = (
    useSegments: boolean,
    segmentCount: number,
    passwordLength: number,
    includeNumbers: boolean,
    includeSymbols: boolean,
    includeUppercase: boolean,
    amount: number = 1
): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()';

    let characterSet = characters;
    if (includeNumbers) {
        characterSet += numbers;
    }
    if (includeSymbols) {
        characterSet += symbols;
    }
    if (includeUppercase) {
        characterSet += characters.toUpperCase();
    }

    const generateSegment = () => {
        let segment = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            segment += characterSet[randomIndex];
        }
        return segment;
    };

    const results: string[] = [];

    for (let a = 0; a < amount; a++) {
        if (useSegments) {
            const segments: string[] = [];
            for (let i = 0; i < segmentCount; i++) {
                segments.push(generateSegment());
            }
            results.push(segments.join('-'));
        } else {
            let password = '';
            for (let i = 0; i < passwordLength; i++) {
                const randomIndex = Math.floor(Math.random() * characterSet.length);
                password += characterSet[randomIndex];
            }
            results.push(password);
        }
    }
    return results.join("\n");
};