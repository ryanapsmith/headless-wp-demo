export type AppConfiguration = {
    siteName: string;
    userEndpointPath: string;
    apolloServerEndpoint: string;
    siteId: string;
    categoriesMap: string[];
    priorityTags: string[];
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PUBLIC_URL: string;
        }
    }
    interface Window {
        appConfiguration: string | undefined;
    }
}