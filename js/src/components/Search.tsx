import React from 'react';
import SearchBar from './SearchBar';

const Search = ({searchTerm, onSearchChange}: SearchProps) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return <SearchBar searchTerm={searchTerm} placeholder='Search by Name' handleInputChange={handleInputChange} />
}

export default Search;