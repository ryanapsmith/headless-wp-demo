import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppConfiguration } from '../types/AppConfiguration';

export interface ConfigContextProps {
    config: AppConfiguration | null;
    configLoading: boolean;
    configError: string | null;
}

const ConfigContext = createContext<ConfigContextProps>({
    config: null,
    configLoading: true,
    configError: null,
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<AppConfiguration | null>(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [configError, setConfigError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = () => {
            const configString = window.appConfiguration;
            
            if (configString) {
                try {
                    const parsedConfig: AppConfiguration = JSON.parse(configString);
                    Object.keys(parsedConfig).forEach((key) => {
                        if (Array.isArray(parsedConfig[key]) && parsedConfig[key].length === 0) {
                          parsedConfig[key] = null;
                        }
                      });
                    setConfig({ ...parsedConfig });
                } catch (parseError) {
                    console.error("Error parsing appConfiguration:", parseError);
                    setConfigError("Failed to parse configuration.");
                }
            } else {
                console.warn("appConfiguration not found on window object.");
                setConfigError("Configuration not found.");
            }
            setConfigLoading(false);
        };
        fetchConfig();
    }, []); 
    const contextValue = useMemo(() => ({ config, configLoading, configError }), [config, configLoading, configError]);

    return (
        <ConfigContext.Provider value={contextValue}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextProps => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};