import React, {createContext, useState, ReactNode, useEffect} from 'react'
// import axios from "axios"
import jwt_decode from "jwt-decode";

export const UserContext = createContext(null)

export const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null)

    console.log(user);

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const userWithToken = await JSON.parse(localStorage.getItem('token') || 'null')
        if (userWithToken) {
            const loggedInUser = jwt_decode(userWithToken);
            setUser(loggedInUser)
        }
    }
    

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}