import React from 'react';
import getConfigForRoute from '../../config';
import CheckboxGroup from './CheckboxGroup';
import TagCloud from './TagCloud';
import SelectGroup from './SelectGroup';
import { useLocation } from 'react-router';
import { keyframes } from 'styled-components';

const MetaFilters = ({
  metaByKey,
  checkedState,
  handleFilterChange,
}: MetaFilterProps) => {
  const location = useLocation();
  const currentRoute = location.pathname; 
  const { metaConfig }  = getConfigForRoute(currentRoute);
    
  return (
    <>
      {Object.entries(metaByKey || {}).map(([key, terms]) => {
                const sortedTerms = [...terms].sort((a, b) => a.value.localeCompare(b.value));
                const metaLabel = metaConfig.find(t => t.key === key)?.label || key.replace(/_/g, ' ');
                const display = metaConfig.find(t => t.key === key)?.display || 'checkbox';
                const labelType = metaConfig.find(t => t.key === keyframes)?.labelType || 'text';

                if (display === 'none') return;
                
                return (<div key={key}>
                    <h3>{metaLabel}</h3>
                    {display === 'checkbox' &&
                        <CheckboxGroup key={key} terms={sortedTerms} checkedState={checkedState} handleFilterChange={handleFilterChange} labelType={labelType} />
                    }
                    {display === 'tag' &&
                        <TagCloud terms={sortedTerms} checkedState={checkedState} handleFilterChange={handleFilterChange} />
                    }
                    {display === 'select' &&
                        <SelectGroup terms={sortedTerms} checkedState={checkedState} handleFilterChange={handleFilterChange} />
                    }
                </div>)
            })}
    </>
  );
};

export default MetaFilters;