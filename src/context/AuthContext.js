import { createContext, useContext, useState } from 'react';
import { getUser, getToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUser());
    const [token, setToken] = useState(getToken());

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
    };

    return (
        <AuthContext.Provider value={{ user, token, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);