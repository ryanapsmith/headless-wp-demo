import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { formatLabel } from '../utils/formatters';
import styled from 'styled-components';
import Tag from './Tag';
import SearchBar from './SearchBar';

const TagCloudContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const ShowAllLink = styled.a`
    cursor: pointer;
    text-decoration: none;
    color: #6EC1E4;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    display: block;
`;

const TagCloud = ({
    terms,
    checkedState,
    handleFilterChange
}: FilterUIProps) => {
    const [filteredTerms, setFilteredTerms] = useState(terms);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerms, setSelectedTerms] = useState<Term[]>(
        () => Array.isArray(terms) ? terms.filter((term) => {
            const termKey = `${term.name ?? term.value}_${term.taxonomy ?? term.key}`;
            const isSelected = checkedState[termKey] || false;
            return isSelected;
        }) : []
    );
    const [showAll, setShowAll] = useState(false); // State to control showing all tags
    const numToShow = showAll ? filteredTerms.length : Math.min(10, filteredTerms.length);
    const numHidden = filteredTerms.length - numToShow;

    const clearFilters = () => {
        selectedTerms.map((term) => {
            handleFilterChange(term, false, 'tag')
        });
        setSelectedTerms([]);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newTerm = event.target.value.toLowerCase();
        setSearchTerm(newTerm);
        setFilteredTerms(
            terms.filter(
                (term) =>
                    (term.name && term.name.toLowerCase().includes(newTerm)) ||
                    (term.value && term.value.toLowerCase().includes(newTerm))
            )
        );
        setShowAll(false);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchTerm) {
            const matchingTerm = terms.find(
                (term) =>
                    (term.name && term.name.toLowerCase() === searchTerm.toLowerCase()) ||
                    (term.value && term.value.toLowerCase() === searchTerm.toLowerCase())
            );
            if (matchingTerm) {
                handleClick(matchingTerm);
                setSearchTerm('');
            }
        }
    };
    const handleClick = useCallback((term: Term) => {
        const termKey = `${term.name ?? term.value}_${term.taxonomy ?? term.key}`;
        const isSelected = checkedState[termKey] || false;
        setSelectedTerms(prevSelectedTerms => isSelected
            ? prevSelectedTerms.filter(st => st !== term)
            : [...prevSelectedTerms, term]
        );
        handleFilterChange(term, !isSelected, "tag");
    }, [handleFilterChange, selectedTerms]);

    return (
        <>
            <button onClick={clearFilters}>Clear</button>
            <div className='tag-cloud'>
                <SearchBar
                    searchTerm={searchTerm}
                    placeholder="Search"
                    handleInputChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                />
                <TagCloudContainer>
                    {filteredTerms.slice(0, numToShow).map((term) => {
                        const termKey = `${term.name ?? term.value}_${term.taxonomy ?? term.key}`;
                        const isSelected = checkedState[termKey] || false;
                        const label = term.name ?? term.value;
                        return (
                            <Tag
                                key={termKey}
                                $isSelected={isSelected}
                                onClick={(e) => handleClick(term)}
                            >
                                {formatLabel(label)}
                            </Tag>
                        )
                    })}
                </TagCloudContainer>
                {numHidden > 0 && ( // Conditionally render the "Show All" link
                    <ShowAllLink onClick={() => setShowAll(true)}>
                        +{numHidden} more
                    </ShowAllLink>
                )}
            </div>
        </>
    );
};

export default TagCloud;