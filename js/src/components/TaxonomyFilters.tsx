import React from 'react';
import getConfigForRoute from '../../config';
import CheckboxGroup from './CheckboxGroup';
import TagCloud from './TagCloud';
import SelectGroup from './SelectGroup';
import { useLocation, useParams } from 'react-router';

const TaxonomyFilters = ({
    termsByTaxonomy,
    checkedState,
    handleFilterChange,
}: TaxonomyFilterProps) => {
    const location = useLocation();
    const currentRoute = location.pathname; 
    const { taxonomyConfig }  = getConfigForRoute(currentRoute);

    return (
        <>
            {Object.entries(termsByTaxonomy || {}).map(([taxonomy, terms]) => {
                const taxonomyLabel = taxonomyConfig.find(t => t.name === taxonomy)?.label || taxonomy.replace(/_/g, ' ');
                const display = taxonomyConfig.find(t => t.name === taxonomy)?.display || 'checkbox';
                const labelType = taxonomyConfig.find(t => t.name === taxonomy)?.labelType || 'text';

                if (display === 'none') return;
                
                return (<div key={taxonomy} className={`${taxonomy}-group`}>
                    <h3>{taxonomyLabel}</h3>
                    {display === 'checkbox' &&
                        <CheckboxGroup key={taxonomy} terms={terms} checkedState={checkedState} handleFilterChange={handleFilterChange} labelType={labelType} />
                    }
                    {display === 'tag' &&
                        <TagCloud terms={terms} checkedState={checkedState} handleFilterChange={handleFilterChange} />
                    }
                    {display === 'select' &&
                        <SelectGroup terms={terms} checkedState={checkedState} handleFilterChange={handleFilterChange} />
                    }
                </div>)
            })}
        </>
    );
}

export default TaxonomyFilters;