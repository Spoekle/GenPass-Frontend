import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Alert from './Alert';

interface AlertContextProps {
    addAlert: (message: string, type: 'error' | 'success' | 'alert') => void;
}

interface AlertItem {
    message: string;
    type: 'error' | 'success' | 'alert';
    id: number;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const addAlert = (message: string, type: 'error' | 'success' | 'alert') => {
        const id = Date.now();
        setAlerts((prevAlerts) => [...prevAlerts, { message, type, id }]);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
        }, 3000);
    };

    const removeAlert = (id: number) => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ addAlert }}>
            {children}
            <div className="fixed top-24 right-4 z-50 space-y-3 flex flex-col items-end">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <Alert 
                            key={alert.id} 
                            message={alert.message} 
                            type={alert.type} 
                            onClose={() => removeAlert(alert.id)} 
                        />
                    ))}
                </AnimatePresence>
            </div>
        </AlertContext.Provider>
    );
};