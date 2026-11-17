import React, { useCallback } from 'react';
import { formatIconString, formatLabel } from '../utils/formatters';

const CheckboxGroup = ({
    terms,
    checkedState,
    handleFilterChange,
    labelType
}: FilterUIProps) => {
    const clearFilters = useCallback(() => {
        terms.map((term) => {
            handleFilterChange(term, false, 'checkbox');
        });
    }, []);
    return (
        <>
            <button onClick={clearFilters}>Clear</button>
            {terms.map((term) => {
                let termKey = `${term.name ?? term.value}_${term.taxonomy ?? term.key}`;
                let label = term.name ?? term.value;
                return (
                    <div key={termKey}>
                        <label>
                            <input
                                type="checkbox"
                                value={termKey}
                                checked={checkedState[termKey] || false}
                                onChange={(e) => handleFilterChange(term, e.target.checked)}
                            />{formatLabel(label)
                            }
                        </label>
                    </div>
                )
            })}
        </>
    );
};

export default CheckboxGroup;