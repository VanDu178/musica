import { createContext, useContext, useState } from "react";

// Tạo context
const IsVisiableRootModalContext = createContext();

export const IsVisiableRootModalProvider = ({ children }) => {
    const [isVisiableRootModal, setIsVisiableRootModal] = useState(false);

    return (
        <IsVisiableRootModalContext.Provider value={{ isVisiableRootModal, setIsVisiableRootModal }}>
            {children}
        </IsVisiableRootModalContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useIsVisiableRootModal = () => {
    return useContext(IsVisiableRootModalContext);
};
