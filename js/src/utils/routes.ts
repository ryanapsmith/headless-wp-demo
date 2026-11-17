import { cleanForSlug } from "@wordpress/url";
import { AppConfiguration } from "../types/AppConfiguration";

interface AppConfig {
    categoriesMap: { [category: string]: string[] };
}

function decodeSpecificEntities(input: string): string {
    return input
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ');

}

function generatePath(input: string) {
    return cleanForSlug(decodeSpecificEntities(input));
}

export const getTermFromPath = (path: string, config: AppConfig): Term | undefined => {
    const { categoriesMap } = config;

    for (const category in categoriesMap) {
        if (categoriesMap.hasOwnProperty(category)) {  // Important!
            const terms = categoriesMap[category];

            // Check if the category name itself matches (top-level)
            if (generatePath(category) === path) {
                return { name: category, type: 'taxonomy', taxonomy: 'categories' };
            }

            // Check if any of the terms within the folder match (child-level)
            for (const term of terms) {
                if (generatePath(term) === path) {
                    return { name: term, type: 'taxonomy', taxonomy: 'categories' };
                }
            }
        }
    }

    return undefined; // Return undefined if no match is found
};

export const getPathFromTerm = (term: Term, config: AppConfiguration): string | undefined => {
    const { categoriesMap } = config;
    for (const category in categoriesMap) {
        if (categoriesMap.hasOwnProperty(category)) {
            const subCategories = categoriesMap[category];

            if (category === term.name) {
                return '/recipe/' + generatePath(term.name);
            }

            for (const subCategory of subCategories) {
                if (subCategory === term.name) {
                    return '/recipe/' + generatePath(subCategory) + '/' + generatePath(term.name);
                }
            }
        }
    }

    return undefined;
}