import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    getStandardOptions,
    getCustomOptions,
    Option
} from '../../helper/Passwords/GeneratePass';
import * as api from '../../services/api';
import Button from './components/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CustomCheckbox from './components/CustomCheckbox';
import { useAlert, AlertProvider } from './components/AlertContext';
import { FaShieldAlt, FaKey, FaLock, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const Generator = () => {
    const savedOptions = JSON.parse(localStorage.getItem("genpassOptions") || '{}');
    const [password, setPassword] = useState('');
    const [passwordFileURL, setPasswordFileURL] = useState<string>('');
    const [numOptions, setNumOptions] = useState(savedOptions.numOptions ?? 2);
    const [passwordLength, setPasswordLength] = useState(savedOptions.passwordLength ?? 12);
    const [segmentCount, setSegmentCount] = useState(savedOptions.segmentCount ?? 3);
    const [useSegments, setUseSegments] = useState(savedOptions.useSegments ?? true);
    const [useCustomList, setUseCustomList] = useState(savedOptions.useCustomList ?? false);
    const [useDefaultList, setUseDefaultList] = useState(savedOptions.useDefaultList ?? true);
    const [replaceChars, setReplaceChars] = useState(savedOptions.replaceChars ?? true);
    const [isAdvanced, setIsAdvanced] = useState(savedOptions.isAdvanced ?? false);
    const [includeNumbers, setIncludeNumbers] = useState(savedOptions.includeNumbers ?? false);
    const [includeSymbols, setIncludeSymbols] = useState(savedOptions.includeSymbols ?? false);
    const [includeUppercase, setIncludeUppercase] = useState(savedOptions.includeUppercase ?? false);
    const [passwordAmount, setPasswordAmount] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);

    const { addAlert } = useAlert();

    useEffect(() => {
        const opts = { numOptions, passwordLength, segmentCount, useSegments, useCustomList, useDefaultList, replaceChars, isAdvanced, includeNumbers, includeSymbols, includeUppercase, passwordAmount };
        localStorage.setItem("genpassOptions", JSON.stringify(opts));
    }, [numOptions, passwordLength, segmentCount, useSegments, useCustomList, useDefaultList, replaceChars, isAdvanced, includeNumbers, includeSymbols, includeUppercase, passwordAmount]);

    const handleGeneratePassword = async () => {
        setIsGenerating(true);
        try {
            let pass: string;
            if (isAdvanced) {
                pass = await api.generateAdvancedPassword(
                    useSegments,
                    segmentCount,
                    passwordLength,
                    includeNumbers,
                    includeSymbols,
                    includeUppercase,
                    passwordAmount
                );
            } else {
                let selectedOptions: Option[] = [];
                if (useDefaultList) {
                    selectedOptions = [...selectedOptions, ...getStandardOptions()];
                }
                if (useCustomList) {
                    selectedOptions = [...selectedOptions, ...getCustomOptions()];
                }
                pass = await api.generatePassword(selectedOptions, numOptions, replaceChars, passwordAmount);
            }
            setPassword(pass);
            setPasswordStrength(calculatePasswordStrength(pass));
            addAlert('Password(s) generated successfully', 'success');
            const blob = new Blob([pass], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            setPasswordFileURL(url);
        } catch (error) {
            console.error('Error generating password:', error);
            addAlert('Failed to generate password', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const calculatePasswordStrength = (password: string) => {
        const pwd = password.split('\n')[0];
        let strength = 0;
        const lengthCriteria = pwd.length >= 12;
        const uppercaseCriteria = /[A-Z]/.test(pwd);
        const lowercaseCriteria = /[a-z]/.test(pwd);
        const numberCriteria = /[0-9]/.test(pwd);
        const symbolCriteria = /[^A-Za-z0-9]/.test(pwd);
        const uniqueCharCriteria = new Set(pwd).size >= pwd.length * 0.7;
        if (lengthCriteria) strength += 1;
        if (uppercaseCriteria) strength += 1;
        if (lowercaseCriteria) strength += 1;
        if (numberCriteria) strength += 1;
        if (symbolCriteria) strength += 1;
        if (uniqueCharCriteria) strength += 1;
        switch (strength) {
            case 0:
            case 1:
            case 2:
                return 'Very Weak';
            case 3:
                return 'Weak';
            case 4:
                return 'Moderate';
            case 5:
                return 'Strong';
            case 6:
                return 'Very Strong';
            default:
                return '';
        }
    };

    const handleCopyPassword = () => {
        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                addAlert('Password(s) copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy password: ', err);
                addAlert('Failed to copy password', 'error');
            });
        }
    };

    const toggleHowItWorks = () => {
        setShowHowItWorks(!showHowItWorks);
        if (showSecurity && !showHowItWorks) {
            setShowSecurity(false);
        }
    };

    const toggleSecurity = () => {
        setShowSecurity(!showSecurity);
        if (showHowItWorks && !showSecurity) {
            setShowHowItWorks(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto py-24 px-4 max-w-6xl"
        >
            {/* Hero Section */}
            <motion.div 
                variants={itemVariants} 
                className="glass-card shadow-xl mb-8 text-center"
            >
                <motion.h1 
                    className="text-4xl md:text-5xl font-bold mb-4 text-white"
                    whileHover={{ scale: 1.01 }}
                >
                    Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-100">GenPass</span>
                </motion.h1>
                <p className="text-gray-300 text-lg mb-6">
                    A secure, privacy-focused password generator that creates memorable yet strong passwords
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    <motion.div 
                        className="flex items-center px-4 py-2 bg-neutral-800 rounded-full text-gray-300"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(38, 38, 38, 0.9)" }}
                    >
                        <FaShieldAlt className="mr-2" /> Secure
                    </motion.div>
                    <motion.div 
                        className="flex items-center px-4 py-2 bg-neutral-800 rounded-full text-gray-300"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(38, 38, 38, 0.9)" }}
                    >
                        <FaKey className="mr-2" /> Client-side Processing
                    </motion.div>
                    <motion.div 
                        className="flex items-center px-4 py-2 bg-neutral-800 rounded-full text-gray-300"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(38, 38, 38, 0.9)" }}
                    >
                        <FaLock className="mr-2" /> Privacy-Focused
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Generator Section */}
                <motion.div variants={itemVariants} className="glass-card shadow-xl">
                    <motion.h2 
                        className="text-3xl font-bold mb-6 text-white"
                        whileHover={{ scale: 1.02 }}
                    >
                        Password Generator
                    </motion.h2>
                    
                    {isAdvanced ? (
                        <Button 
                            onClick={() => setIsAdvanced(false)} 
                            className="mb-6"
                            variant="secondary"
                        >
                            Back to Simple Mode
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => setIsAdvanced(true)} 
                            className="mb-6"
                            variant="secondary"
                        >
                            Advanced Mode
                        </Button>
                    )}
                    
                    <motion.div variants={itemVariants} className="mb-6 glass-dark p-4 rounded-lg">
                        <Typography id="passwordAmount" gutterBottom className="text-white">
                            Number of Passwords: {passwordAmount}
                        </Typography>
                        <TextField
                            id="outlined-size-small"
                            value={passwordAmount}
                            onChange={(e) => setPasswordAmount(parseInt(e.target.value) || 1)}
                            aria-labelledby="passwordAmount"
                            type="number"
                            inputProps={{ min: 1, max: 10 }}
                            className="w-full glass-input"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                },
                                '& .MuiInputBase-input': { color: 'white' }
                            }}
                        />
                    </motion.div>
                    
                    {isAdvanced ? (
                        <motion.div variants={itemVariants}>
                            <div className="mb-6">
                                <motion.div whileHover={{ scale: 1.02 }} className="glass-dark p-4 rounded-lg mb-4">
                                    <CustomCheckbox 
                                        checked={useSegments} 
                                        onChange={() => setUseSegments(!useSegments)} 
                                        label="Use Segments" 
                                    />
                                    
                                    {useSegments ? (
                                        <>
                                            <Typography id="segmentCount" gutterBottom className="text-white mt-3">
                                                Amount of segments: {segmentCount}
                                            </Typography>
                                            <Slider
                                                value={segmentCount}
                                                onChange={(_e, value) => setSegmentCount(value as number)}
                                                aria-labelledby="segmentCount"
                                                min={2}
                                                max={6}
                                                valueLabelDisplay="auto"
                                                sx={{ 
                                                    color: '#6366f1',
                                                    '& .MuiSlider-thumb': {
                                                        '&:hover, &.Mui-focusVisible': {
                                                            boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Typography id="passwordLength" gutterBottom className="text-white mt-3">
                                                Password Length: {passwordLength}
                                            </Typography>
                                            <Slider
                                                value={passwordLength}
                                                onChange={(_e, value) => setPasswordLength(value as number)}
                                                aria-labelledby="passwordLength"
                                                min={8}
                                                max={32}
                                                valueLabelDisplay="auto"
                                                sx={{ 
                                                    color: '#6366f1',
                                                    '& .MuiSlider-thumb': {
                                                        '&:hover, &.Mui-focusVisible': {
                                                            boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)'
                                                        }
                                                    }
                                                }}
                                            />
                                        </>
                                    )}
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.02 }} className="glass-dark p-4 rounded-lg mb-6">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <CustomCheckbox 
                                            checked={includeNumbers} 
                                            onChange={() => setIncludeNumbers(!includeNumbers)} 
                                            label="Include Numbers" 
                                        />
                                        <CustomCheckbox 
                                            checked={includeSymbols} 
                                            onChange={() => setIncludeSymbols(!includeSymbols)} 
                                            label="Include Symbols" 
                                        />
                                        <CustomCheckbox 
                                            checked={includeUppercase} 
                                            onChange={() => setIncludeUppercase(!includeUppercase)} 
                                            label="Include Uppercase Letters" 
                                        />
                                    </div>
                                </motion.div>
                            </div>
                            
                            <Button 
                                onClick={handleGeneratePassword} 
                                variant="success"
                                className="w-full py-3 text-lg mb-4"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Password(s)'}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants}>
                            <motion.div whileHover={{ scale: 1.02 }} className="glass-dark p-4 rounded-lg mb-4">
                                <Typography id="numOptions" gutterBottom className="text-white">
                                    Number of words: {numOptions}
                                </Typography>
                                <Slider
                                    value={numOptions}
                                    onChange={(_e, value) => setNumOptions(value as number)}
                                    aria-labelledby="numOptions"
                                    min={1}
                                    max={5}
                                    valueLabelDisplay="auto"
                                    sx={{ 
                                        color: '#6366f1',
                                        '& .MuiSlider-thumb': {
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)'
                                            }
                                        }
                                    }}
                                />
                            </motion.div>
                            
                            <motion.div whileHover={{ scale: 1.02 }} className="glass-dark p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <CustomCheckbox 
                                        checked={useDefaultList} 
                                        onChange={() => setUseDefaultList(!useDefaultList)} 
                                        label="Use Default Words" 
                                    />
                                    <CustomCheckbox 
                                        checked={useCustomList} 
                                        onChange={() => setUseCustomList(!useCustomList)} 
                                        label="Use Custom Words" 
                                    />
                                    <CustomCheckbox 
                                        checked={replaceChars} 
                                        onChange={() => setReplaceChars(!replaceChars)} 
                                        label="Use Special Characters" 
                                    />
                                </div>
                            </motion.div>
                            
                            <Button 
                                onClick={handleGeneratePassword} 
                                variant="success"
                                className="w-full py-3 text-lg mb-4"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Password(s)'}
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
                
                {/* Results Section */}
                <motion.div variants={itemVariants}>
                    {password ? (
                        <motion.div 
                            className="glass-card shadow-xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                        >
                            <motion.h2 
                                className="text-2xl font-bold text-white mb-4"
                            >
                                Generated Password(s):
                            </motion.h2>
                            
                            <motion.pre 
                                className="max-h-[50vh] overflow-y-auto bg-neutral-800/60 backdrop-blur-sm
                                border border-neutral-700 text-white font-bold py-4 px-6 rounded-lg mt-4 whitespace-pre-wrap"
                                whileHover={{ 
                                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                                    scale: 1.01
                                }}
                            >
                                {password}
                            </motion.pre>
                            
                            <div className="flex space-x-4 mt-6 mb-2">
                                <Button 
                                    onClick={handleCopyPassword} 
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Copy Password(s)
                                </Button>
                                
                                {passwordFileURL && (
                                    <Button 
                                        onClick={() => {}} 
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        <a href={passwordFileURL} download="passwords.txt" className="w-full h-full block">
                                            Download Password(s)
                                        </a>
                                    </Button>
                                )}
                            </div>
                            
                            <motion.div 
                                className={`mt-4 text-lg font-bold p-2 rounded-lg text-center ${
                                    passwordStrength === 'Very Weak' || passwordStrength === 'Weak'
                                        ? 'bg-red-500/20 text-red-400'
                                        : passwordStrength === 'Moderate'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-green-500/20 text-green-400'
                                }`}
                                whileHover={{ scale: 1.03 }}
                            >
                                Password Strength: {passwordStrength}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {/* How GenPass Works Section */}
                            <motion.div 
                                variants={itemVariants}
                                className="glass-card shadow-xl"
                            >
                                <div 
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={toggleHowItWorks}
                                >
                                    <motion.h2 
                                        className="text-2xl font-bold text-white flex items-center"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <FaInfoCircle className="mr-3" /> How GenPass Works
                                    </motion.h2>
                                    {showHowItWorks ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                                
                                <AnimatePresence>
                                    {showHowItWorks && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 space-y-4 text-gray-300">
                                                <p>
                                                    GenPass generates strong yet memorable passwords using a unique approach that combines random words with special characters. Unlike traditional random string generators, GenPass creates passwords that are easier to remember but still highly secure.
                                                </p>
                                                
                                                <h3 className="text-white font-bold text-lg">Two Operating Modes:</h3>
                                                
                                                <div className="pl-4 border-l-2 border-neutral-700">
                                                    <h4 className="font-bold text-white">Simple Mode:</h4>
                                                    <p>Combines multiple random words from either the default dictionary or your custom words list. Words can be replaced with special characters for added security.</p>
                                                </div>
                                                
                                                <div className="pl-4 border-l-2 border-neutral-700">
                                                    <h4 className="font-bold text-white">Advanced Mode:</h4>
                                                    <p>Creates truly random character sequences with options for segments, numbers, symbols, and uppercase letters. Perfect for maximum security requirements.</p>
                                                </div>
                                                
                                                <div className="mt-4">
                                                    <p>All processing happens locally in your browser, ensuring your generated passwords are never transmitted over the internet or stored on remote servers.</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            
                            {/* Security Features Section */}
                            <motion.div 
                                variants={itemVariants} 
                                className="glass-card shadow-xl"
                            >
                                <div 
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={toggleSecurity}
                                >
                                    <motion.h2 
                                        className="text-2xl font-bold text-white flex items-center"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <FaShieldAlt className="mr-3" /> Security & Privacy
                                    </motion.h2>
                                    {showSecurity ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                                
                                <AnimatePresence>
                                    {showSecurity && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 space-y-4 text-gray-300">
                                                <h3 className="text-white font-bold text-lg">Privacy-First Approach:</h3>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    <li>
                                                        <span className="text-white font-medium">Client-side Processing:</span> All password generation happens entirely in your browser. Your passwords are never sent to any server.
                                                    </li>
                                                    <li>
                                                        <span className="text-white font-medium">No Analytics or Tracking:</span> GenPass doesn't use cookies, analytics, or any other tracking mechanisms.
                                                    </li>
                                                    <li>
                                                        <span className="text-white font-medium">Local Storage Only:</span> Your preferences are stored locally on your device using your browser's local storage.
                                                    </li>
                                                </ul>
                                                
                                                <h3 className="text-white font-bold text-lg">Security Measures:</h3>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    <li>
                                                        <span className="text-white font-medium">Cryptographically Secure:</span> Passwords are generated using cryptographically secure random number generation.
                                                    </li>
                                                    <li>
                                                        <span className="text-white font-medium">High Entropy:</span> The advanced mode provides maximum randomness and entropy for highly secure passwords.
                                                    </li>
                                                    <li>
                                                        <span className="text-white font-medium">Strength Indicator:</span> Visual feedback on your password strength helps ensure you're creating secure credentials.
                                                    </li>
                                                </ul>
                                                
                                                <div className="mt-4 bg-neutral-800/60 p-4 rounded-lg border border-neutral-700">
                                                    <p className="italic">
                                                        "The most secure password is one you can actually remember. GenPass creates passwords that balance memorability with security."
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

const App = () => (
    <AlertProvider>
        <Generator />
    </AlertProvider>
);

export default App;