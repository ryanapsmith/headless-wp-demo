import React, { useCallback, useEffect, useState } from 'react';
import Search from './Search';
import MetaFilters from './MetaFilters';
import TaxonomyFilters from './TaxonomyFilters';
import { useLocation, useParams } from 'react-router';

const Sidebar = ({ searchTerm, onSearchChange, terms, onTermsFilterChange, selectedTerms }: SidebarProps) => {
    const location = useLocation();
    const { category, subcategory } = useParams();
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

    let currentSelectedTerms: Term[] = selectedTerms;
    
    useEffect(() => {
        if (terms) {
            const newState: { [key: string]: boolean } = {};
            selectedTerms.forEach((st) => {
                // Use key and value if name and taxonomy are null
                console.log(st)
                const key = st.name && st.taxonomy
                    ? `${st.name}_${st.taxonomy}`
                    : `${st.value}_${st.key}`;
                newState[key] = true;
            });
            setCheckedState(newState);
        }
        currentSelectedTerms = selectedTerms;
    }, [selectedTerms, onTermsFilterChange, location.pathname]);

    const handleFilterChange = useCallback((term: Term, checked: boolean, type: string = "checkbox", lastSelectedTermKey: string = '') => {
        let isChecked = checked;
        const checkedStateKey = term.type === 'meta' ? `${term.value}_${term.key}` : `${term.name}_${term.taxonomy}`;

        setCheckedState({ ...checkedState, [checkedStateKey]: isChecked });

        currentSelectedTerms = currentSelectedTerms.filter((st) => {
            const key = st.type === 'meta' ? `${st.value}_${st.key}` : `${st.name}_${st.taxonomy}`;
            return (type === 'select') ? !(key === lastSelectedTermKey) : (checkedState[key] ?? false);
        });

        if (isChecked) {
            currentSelectedTerms.push(term);
        } else {
            currentSelectedTerms = currentSelectedTerms.filter((st) => {
                return !(st.type === 'meta' ? (st.key === term.key && st.value === term.value) : (st.name === term.name && st.taxonomy === term.taxonomy));
            });
        }
        
        onTermsFilterChange(currentSelectedTerms);
    }, [terms, selectedTerms, checkedState, onTermsFilterChange]);

    const termsByType = terms?.reduce((acc: Record<string, Term[]>, term) => {
        if (!acc[term.type]) {
            acc[term.type] = [];
        }
        acc[term.type].push(term);
        return acc;
    }, {});

    const termsByTaxonomy = termsByType?.taxonomy?.reduce((acc: Record<string, Term[]>, term) => {
        if (!acc[term.taxonomy]) {
            acc[term.taxonomy] = [];
        }
        acc[term.taxonomy].push(term);
        return acc;
    }, {}) || {};

    const metaByKey = termsByType?.meta?.reduce((acc: Record<string, Term[]>, term) => {
        if (!acc[term.key]) {
            acc[term.key] = [];
        }
        acc[term.key].push(term);
        return acc;
    }, {}) || {};

    return (
        <aside>
            {(!category || category === undefined) && <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />}
            {termsByTaxonomy && <TaxonomyFilters
                termsByTaxonomy={termsByTaxonomy}
                checkedState={checkedState}
                handleFilterChange={handleFilterChange}
            />}
            {metaByKey && <MetaFilters
                metaByKey={metaByKey}
                checkedState={checkedState}
                handleFilterChange={handleFilterChange}
            />}
        </aside>
    );
};

export default Sidebar;