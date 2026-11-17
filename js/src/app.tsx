import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import createApolloClient from './utils/apolloClient';
import { useConfig } from './context/AppConfigurationContext';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { RecipesPage } from './pages';

const App = () => {
    const { config, configLoading: configLoading, configError: configError } = useConfig();
    const [client, setClient] = useState<ApolloClient<any> | null>(null);

    useEffect(() => {
        if (!configLoading) {
            setClient(createApolloClient(config));
        }
    }, [configLoading]);

    if (!config || configLoading) {
        return <div>Loading configuration...</div>;
    }

    if (configError) {
        console.error("Couldn't load config");
        return <div>Something went wrong</div>
    }


    if (!client) {
        return <div>Initializing Apollo Client...</div>;
    }

    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route path="/recipe/:category?/:subcategory?" element={<RecipesPage config={config} />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;