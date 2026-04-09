import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    // Setting global axios defaults here is smart!
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // Changed false to null

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            setIsLoggedIn(false);
    setUserData(false);
        }
    };

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedIn(true);
                // We only fetch user data if the auth check actually passes
                await getUserData(); 
            }
        } catch (error) {
            // No toast here because we don't want to annoy logged-out users
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    useEffect(() => {
        getAuthState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only runs once on mount

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData, getAuthState
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};