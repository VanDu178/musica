import { createContext, useContext, useState } from "react";

// Tạo context
const IsPlayingContext = createContext();

export const IsPlayingProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <IsPlayingContext.Provider value={{ isPlaying, setIsPlaying }}>
            {children}
        </IsPlayingContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useIsPlaying = () => {
    return useContext(IsPlayingContext);
};
