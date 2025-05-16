import { createContext, useState } from "react";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const [showPassword, setShowPassword] = useState(false);
    const [LoggedOut, setLoggedOut] = useState(true)


    const handleCheckboxChange = () => {
        setShowPassword((prev) => !prev);
    };

    const contextValue = {
        setShowPassword,
        showPassword,
        handleCheckboxChange,
        LoggedOut, 
        setLoggedOut,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;