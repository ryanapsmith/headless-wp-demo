const routeConfigs = {
    '/recipe': {
        taxonomyConfig: [
            { name: 'category', type: 'or', label: 'Categories', display: 'checkbox', labelType: 'text' },
            { name: 'post_tag', type: 'filter', label: 'Tags', display: 'tag' },
            { name: 'occasions', type: 'filter', label: 'Occasions', display: 'checkbox', labelType: 'text' }
        ],
        metaConfig: [
            { key: 'servings', type: 'filter', label: 'Serves', display: 'select' },
        ],
        labelOverrides: {},
        termIgnoreList: []
    }
}

function getConfigForRoute(route) {
    const secondSlashIndex = route.indexOf("/", 1);
    const path = secondSlashIndex === -1 ? route : route.substring(0, secondSlashIndex);
    return routeConfigs[path] ?? undefined;
};

export default getConfigForRoute;