import { createContext, useContext, useState } from "react";

// Tạo context
const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [playlist, setPlaylist] = useState([]);

    // Hàm thêm bài hát vào playlist
    const addSong = (song) => {
        setPlaylist((prev) => [...prev, song]);
    };

    // Hàm xóa một bài hát khỏi playlist
    const removeSong = (id) => {
        setPlaylist((prev) => prev.filter((song) => song.id !== id));
    };

    // Hàm xóa toàn bộ playlist
    const clearPlaylist = () => {
        setPlaylist([]);
    };

    return (
        <PlaylistContext.Provider value={{ playlist, addSong, removeSong, clearPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
};

// Custom hook để sử dụng context
export const usePlaylist = () => {
    return useContext(PlaylistContext);
};
