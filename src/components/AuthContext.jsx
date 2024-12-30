import React from 'react'
import {
    createContext,
    useContext,
    useState
} from 'react'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({
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
    })

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}