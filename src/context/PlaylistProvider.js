import { createContext, useContext, useState } from "react";

// Tạo context
const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [idPlaylist, setIdPlaylist] = useState(null);

    return (
        <PlaylistContext.Provider value={{ idPlaylist, setIdPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
};

// Custom hook để sử dụng context
export const usePlaylist = () => {
    return useContext(PlaylistContext);
};