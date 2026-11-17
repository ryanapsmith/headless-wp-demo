import React, { useState } from 'react';
import { formatLabel } from '../utils/formatters';


const SelectGroup = ({
    terms,
    checkedState,
    handleFilterChange,
}: FilterUIProps) => {
    const [lastSelectedTermKey, setLastSelectedTermKey] = useState<string | null>(
        () => {
            const selectedTerm = Array.isArray(terms) && terms.find((term) => {
                const termKey = `${term.name ?? term.value}_${term.taxonomy ?? term.key}`;
                const isSelected = checkedState[termKey] || false;
                return isSelected;
            });

            return selectedTerm ? `${selectedTerm.name ?? selectedTerm.value}_${selectedTerm.taxonomy ?? selectedTerm.key}` : null;
        }
    );
    
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTermKey = event.target.value;
        let selectedTerm = terms.find(term => `${term.name ?? term.value}_${term.taxonomy ?? term.key}` === selectedTermKey);
        
        if (selectedTerm) {
            handleFilterChange(selectedTerm, true, 'select', lastSelectedTermKey);
            setLastSelectedTermKey(selectedTermKey);
        } else {
            let lastSelectedTerm = terms.find(term => `${term.name ?? term.value}_${term.taxonomy ?? term.key}` === lastSelectedTermKey);
            handleFilterChange(lastSelectedTerm, false, 'select');
            setLastSelectedTermKey(null);
        }
    };
    return (
        <select onChange={handleChange} value={lastSelectedTermKey || ''}>
            <option value="">Select an option</option>
            {terms.map((term) => {
                let termKey = `${term.name ?? term.value}_${term.taxonomy ?? term.key}`;
                let label = term.name ?? term.value;
                return (
                    <option key={termKey} value={termKey}>
                        {formatLabel(label)}
                    </option>
                );
            })}
        </select>
    );
};

export default SelectGroup;