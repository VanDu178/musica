import { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosConfig";

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

  // Hàm gọi xuống backend để lấy danh sách bài hát theo playlistId
  const fetchSongsByPlaylistId = async (playlistId) => {
    try {
      const response = await axiosInstance.get(
        `/playlists/${playlistId}/songs`
      );
      const songs = response.data; // Lấy dữ liệu từ response
      //   setPlaylist(songs); // Cập nhật danh sách bài hát vào state
      //   console.log("Songs fetched:", songs);
      return songs;
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        addSong,
        removeSong,
        clearPlaylist,
        fetchSongsByPlaylistId,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom hook để sử dụng context
export const usePlaylist = () => {
  return useContext(PlaylistContext);
};
