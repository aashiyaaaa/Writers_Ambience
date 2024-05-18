import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder:string;
    searchType:string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder, searchType}) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='flex justify-center items-center space-x-5'>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder = {placeholder}
                onKeyPress={handleKeyPress}
                className='m-5 p-1 text-[var(--text)] w-3/4'
            />
            <button className="px-3 p-1 m-2 hover:bg-[var(--projectIsland)] hover:text-[var(--text)]" onClick={handleSearch}
                style={{
                    borderRadius:5,
                    borderWidth:1,
                    borderColor:"white"
                }}
            >{searchType}</button>
        </div>
    );
};

export default SearchBar;
