import React from 'react'
import {
    createContext,
    useContext,
    useState,
    useEffect
} from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(() => {

        const storedUser = localStorage.getItem('currentUser')
        return storedUser ? JSON.parse(storedUser) : {
            userName: null,
            userEmail: null,
            userPassword: null,
            userStatus: "Normal",
            balanceAmount: 0,
            totalPoints: 0,
            memberLevel: "",
            memberExpired: null,
            registerDate: null,
            lastUsedDate: null,
            trafficUsed: 0,
            registeredIP: "",
            deviceNumber: "",
        }

    })

    useEffect(() => {
        // Persist user data to localStorage whenever it changes
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    const login = (userData) => {
        const updatedUser ={
            ...userData,
            lastUsedDate:new Date().toISOString(),
        }
        setCurrentUser(userData)
    }

    const logout = () => {
        setCurrentUser({
            userName: null,
            userEmail: null,
            userPassword: null,
            userStatus: "Normal",
            balanceAmount: 0,
            totalPoints: 0,
            memberLevel: "",
            memberExpired: null,
            registerDate: null,
            lastUsedDate: null,
            trafficUsed: 0,
            registeredIP: "",
            deviceNumber: "",
        });
        localStorage.removeItem('currentUser');
    };


    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}