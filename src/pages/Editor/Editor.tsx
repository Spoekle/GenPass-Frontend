import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setPasswordOptions, getPasswordOptions, importOptionsFromFile, exportOptionsToFile } from '../../helper/Passwords/Editor';
import Button from './components/Button';
import { useAlert, AlertProvider } from './components/AlertContext';
import MobileWordList from './components/MobileWordList';
import { Option } from '../../helper/Passwords/GeneratePass';

// Animation variants
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

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const listItemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { 
        x: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    },
    exit: { 
        x: -10, 
        opacity: 0,
        transition: { 
            duration: 0.2 
        }
    }
};

const Editor = () => {
    const [options, setOptions] = useState<Option[]>([]);
    const [newOption, setNewOption] = useState('');
    const [newWeight, setNewWeight] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const { addAlert } = useAlert();

    useEffect(() => {
        setOptions(getPasswordOptions());
    }, []);

    const addOption = () => {
        if (newOption.trim() === '') {
            addAlert('Words gotta have letters silly :D', 'error');
            return;
        }
        const updatedOptions = [
            ...options,
            { option: newOption.trim().toLowerCase(), weight: newWeight }
        ];
        setOptions(updatedOptions);
        setPasswordOptions(updatedOptions);
        setNewOption('');
        setNewWeight(1);
        addAlert(`Added word: ${newOption.trim().toLowerCase()}`, 'success');
    };

    const removeOption = (index: number) => {
        const optionToRemove = options[index];
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
        setPasswordOptions(updatedOptions);
        addAlert(`Removed word: ${optionToRemove.option}`, 'alert');
    };

    const updateWeight = (index: number, weight: number) => {
        const updatedOptions = options.map((opt, i) =>
            i === index ? { ...opt, weight } : opt
        );
        setOptions(updatedOptions);
        setPasswordOptions(updatedOptions);
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            importOptionsFromFile(file, (importedOptions: Option[]) => {
                const updatedOptions = [...options, ...importedOptions];
                setOptions(updatedOptions);
                setPasswordOptions(updatedOptions);
            });
            addAlert(`Imported ${file.name} successfully!`, 'success');
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleExport = () => {
        if (options.length === 0) {
            addAlert('No words to export', 'error');
            return;
        }
        exportOptionsToFile(options);
        addAlert('Words exported to JSON file', 'success');
    };

    const clearOptions = () => {
        if (options.length === 0) {
            addAlert('Nothing to clear :)', 'error');
            return;
        }
        setOptions([]);
        setPasswordOptions([]);
        addAlert('Word list cleared successfully!', 'success');
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-24 px-4 max-w-6xl"
        >
            <motion.div variants={itemVariants} className="glass-card shadow-xl">
                <motion.h1 
                    className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                >
                    Password Word Editor
                </motion.h1>

                <motion.div variants={itemVariants} className="mb-6 glass-dark p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-3 text-white">Add New Word</h2>
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addOption()}
                            placeholder="Add new word"
                            className="p-3 rounded backdrop-blur-sm bg-white/10 border border-white/20 text-white w-full
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                        />
                        
                        <div className="flex gap-4 items-center">
                            <label className="text-white">Weight:</label>
                            <input
                                type="number"
                                value={newWeight}
                                onChange={(e) => setNewWeight(parseInt(e.target.value) || 1)}
                                placeholder="Weight"
                                min={1}
                                max={5}
                                className="p-3 rounded backdrop-blur-sm bg-white/10 border border-white/20 text-white w-20
                                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                            />
                            <span className="text-gray-400 text-sm">Higher weight = more likely to be selected</span>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={addOption} 
                        className="mt-4 w-full"
                        variant="primary"
                    >
                        Add Word
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <motion.div 
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`mb-6 p-6 border-2 border-dashed rounded-lg text-center transition-all duration-300
                        ${isDragging 
                            ? 'bg-indigo-500/20 border-indigo-500/80' 
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                        animate={{
                            scale: isDragging ? 1.02 : 1,
                            boxShadow: isDragging ? '0 4px 12px rgba(99, 102, 241, 0.4)' : '0 0 0 rgba(0, 0, 0, 0)'
                        }}
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <motion.div 
                                animate={{ y: isDragging ? [0, -5, 0] : 0 }}
                                transition={{ repeat: isDragging ? Infinity : 0, duration: 1.5 }}
                                className="text-3xl mb-2"
                            >
                                📁
                            </motion.div>
                            <p className="text-white">Drop JSON file here to import your word list</p>
                            <p className="text-gray-400">or</p>
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                id="fileInput"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        importOptionsFromFile(e.target.files[0], (importedOptions: Option[]) => {
                                            const updatedOptions = [...options, ...importedOptions];
                                            setOptions(updatedOptions);
                                            setPasswordOptions(updatedOptions);
                                            addAlert('Words imported successfully', 'success');
                                        });
                                    }
                                }}
                            />
                            <motion.label 
                                htmlFor="fileInput" 
                                className="cursor-pointer bg-indigo-500/20 px-4 py-2 rounded-lg text-white
                                hover:bg-indigo-500/30 transition-all duration-200 border border-indigo-500/40"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Select a file
                            </motion.label>
                        </div>
                    </motion.div>
                    
                    <div className="flex gap-4">
                        <Button 
                            onClick={handleExport} 
                            variant="secondary" 
                            className="flex-1"
                        >
                            Export Words
                        </Button>
                        {options.length > 0 && (
                            <Button 
                                onClick={clearOptions} 
                                variant="danger" 
                                className="flex-1"
                            >
                                Clear All Words
                            </Button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
            
            <motion.div 
                variants={itemVariants}
                className="hidden md:block glass-card shadow-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <motion.h2 
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                    >
                        Current Words
                    </motion.h2>
                    <motion.div 
                        className="bg-indigo-500/30 px-3 py-1 rounded-full text-white font-bold"
                        whileHover={{ scale: 1.05 }}
                    >
                        {options.length} {options.length === 1 ? 'word' : 'words'}
                    </motion.div>
                </div>
                
                <motion.ul 
                    variants={listVariants}
                    className="overflow-y-auto max-h-[65vh] pr-2 space-y-2"
                    animate="visible"
                    initial="hidden"
                >
                    {options.length === 0 ? (
                        <motion.li 
                            variants={listItemVariants}
                            className="text-center text-gray-400 border-2 border-dashed border-white/10 p-6 
                            bg-white/5 rounded-lg flex flex-col items-center"
                        >
                            <span className="text-3xl mb-4">📝</span>
                            <p>No words added yet.</p>
                            <p>Add some words to get started!</p>
                        </motion.li>
                    ) : (
                        options.map((option, index) => (
                            <motion.li 
                                key={index} 
                                variants={listItemVariants}
                                className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm 
                                rounded-lg border border-white/10 hover:bg-white/10 transition duration-200"
                            >
                                <span className="flex-1 text-white">{option.option}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">Weight:</span>
                                    <input
                                        type="number"
                                        value={option.weight}
                                        onChange={(e) => updateWeight(index, parseInt(e.target.value) || 1)}
                                        className="w-16 p-2 rounded bg-white/10 border border-white/20 text-white
                                        focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                        min={1}
                                        max={5}
                                    />
                                    <motion.button 
                                        onClick={() => removeOption(index)} 
                                        className="ml-2 p-2 rounded-lg bg-red-500/20 text-white
                                        hover:bg-red-500/30 transition-colors border border-red-500/30"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        ✕
                                    </motion.button>
                                </div>
                            </motion.li>
                        ))
                    )}
                </motion.ul>
            </motion.div>
            
            <div className="md:hidden">
                <MobileWordList
                    options={options}
                    removeOption={removeOption}
                    updateWeight={updateWeight}
                />
            </div>
        </motion.div>
    );
};

const App = () => (
    <AlertProvider>
        <Editor />
    </AlertProvider>
);

export default App;