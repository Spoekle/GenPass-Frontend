import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaTimes } from 'react-icons/fa';
import './MobileWordList.css';
import type { Option } from '../../../helper/Passwords/GeneratePass';

interface MobileWordListProps {
  options: Option[];
  removeOption: (index: number) => void;
  updateWeight: (index: number, newWeight: number) => void;
}

const MobileWordList: React.FC<MobileWordListProps> = ({ options, removeOption, updateWeight }) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const increaseWeight = (index: number, currentWeight: number) => {
    if (currentWeight < 5) {
      updateWeight(index, currentWeight + 1);
    }
  };

  const decreaseWeight = (index: number, currentWeight: number) => {
    if (currentWeight > 1) {
      updateWeight(index, currentWeight - 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full block md:hidden pb-[40px]">
      <div className="relative">
        {/* Toggle button - always on top of the list */}
        <motion.button
          onClick={toggleList}
          className={`
            w-full flex items-center justify-center py-3 px-4 
            bg-neutral-800 text-white font-medium space-x-2
            border-t border-neutral-700 rounded-t-xl
            ${isListOpen ? 'rounded-t-none' : ''}
          `}
          whileHover={{ backgroundColor: "rgba(38, 38, 38, 1)" }}
          whileTap={{ scale: 0.98 }}
        >
          {isListOpen ? (
            <>
              <FaArrowDown className="mr-2" /> 
              <span>Hide Word List</span> 
              <FaArrowDown className="ml-2" />
            </>
          ) : (
            <>
              <FaArrowUp className="mr-2" /> 
              <span>Show Word List ({options.length})</span> 
              <FaArrowUp className="ml-2" />
            </>
          )}
        </motion.button>

        {/* Animated list panel */}
        <AnimatePresence>
          {isListOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="w-full bg-neutral-900/90 backdrop-blur-md border-x border-neutral-700"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Word List
                  </h2>
                  
                  <div className="px-3 py-1 rounded-full bg-neutral-800 text-white text-sm font-medium">
                    {options.length} {options.length === 1 ? 'word' : 'words'}
                  </div>
                </div>
                
                <motion.div 
                  className="space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    },
                    hidden: {}
                  }}
                >
                  {options.length === 0 ? (
                    <motion.div 
                      className="text-center text-gray-400 border-2 border-dashed border-neutral-700 p-6 
                      bg-neutral-800/50 rounded-lg flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-3xl mb-4">📝</span>
                      <p>No words added yet.</p>
                      <p>Add some words to get started!</p>
                    </motion.div>
                  ) : (
                    options.map((opt, index) => (
                      <motion.div 
                        key={index}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 overflow-hidden"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0, transition: { type: "spring" } }
                        }}
                        whileHover={{ backgroundColor: "#262626" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{opt.option}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Weight:</span>
                            
                            <div className="flex items-center bg-neutral-700 rounded-lg">
                              <motion.button
                                onClick={() => decreaseWeight(index, opt.weight)}
                                disabled={opt.weight <= 1}
                                className={`p-1 rounded-l-lg ${opt.weight <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-600'}`}
                                whileHover={opt.weight > 1 ? { backgroundColor: "#525252" } : {}}
                                whileTap={opt.weight > 1 ? { scale: 0.9 } : {}}
                              >
                                <FaArrowDown className="text-white" />
                              </motion.button>
                              
                              <span className="px-2 text-white bg-neutral-700 font-bold">
                                {opt.weight}
                              </span>
                              
                              <motion.button
                                onClick={() => increaseWeight(index, opt.weight)}
                                disabled={opt.weight >= 5}
                                className={`p-1 rounded-r-lg ${opt.weight >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-600'}`}
                                whileHover={opt.weight < 5 ? { backgroundColor: "#525252" } : {}}
                                whileTap={opt.weight < 5 ? { scale: 0.9 } : {}}
                              >
                                <FaArrowUp className="text-white" />
                              </motion.button>
                            </div>
                            
                            <motion.button
                              onClick={() => removeOption(index)}
                              className="p-1 rounded-full bg-neutral-700 hover:bg-neutral-600"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaTimes className="text-white" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileWordList;