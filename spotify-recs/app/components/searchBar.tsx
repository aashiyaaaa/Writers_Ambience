import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder:string;
    searchType:string;
    isDisabled:boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder, searchType, isDisabled}) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='flex justify-center items-center space-x-2 py-2'>
            <textarea
                value={query}
                onChange={handleInputChange}
                placeholder = {placeholder}
                onKeyPress={handleKeyPress}
                className='m-3 p-1 text-[var(--text)] w-3/4'
                style={{
                    height:300
                }}
            />
            {isDisabled? <button className="px-3 p-1 m-3 hover:bg-[var(--projectIsland)] hover:text-[var(--text)]" 
                onClick={()=>{} } 
                    disabled={isDisabled}
                    style={{
                        borderRadius:5,
                        borderWidth:1,
                        borderColor:"white",
                        backgroundColor:"Red"
                    }}
                >{searchType}</button> :
                
                <button className="px-3 p-1 m-3" 
                onClick={()=>{handleSearch} } 
                    disabled={isDisabled}
                    style={{
                        borderRadius:5,
                        borderWidth:1,
                        borderColor:"white"
                    }}
                >{searchType}</button>
            }
            
        </div>
    );
};

export default SearchBar;
