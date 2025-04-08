import debounce from "lodash/debounce";
import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    return (
        <SearchContext.Provider value={{ searchKeyword, setSearchKeyword, selectedType, setSelectedType }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);