import { createContext, useContext, useState } from "react";

// Tạo context
const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [idSong, setIdSong] = useState(null);

    return (
        <SongContext.Provider value={{ idSong, setIdSong }}>
            {children}
        </SongContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useSong = () => {
    return useContext(SongContext);
};
