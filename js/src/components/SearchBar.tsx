import React, { ChangeEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { ReactComponent as SearchIcon } from '../icons/search.svg';

interface SearchBarProps {
    searchTerm: string;
    placeholder: string;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBarContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    width: 250px;
    margin-bottom: 20px;
    border: 1px solid #ECECEC;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 !important;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 0.875rem;
    appearance: auto;
    outline-offset: initial;
    &:focus {
        box-shadow: none;
        border-color: transparent;
    }
    &::placeholder {
        color: #C7C7C7;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
`;

const SearchBar = ({ searchTerm, placeholder, handleInputChange, onKeyDown }: SearchBarProps) => {
    return (
        <SearchBarContainer>
            <IconWrapper>
                <SearchIcon width="24" height="24" /> {/* Use imported icon directly */}
            </IconWrapper>
            <SearchInput
                type="search"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
            />
        </SearchBarContainer>
    );
};

export default SearchBar;