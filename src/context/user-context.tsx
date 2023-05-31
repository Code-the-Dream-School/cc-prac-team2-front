import React, {createContext, useState, ReactNode, useEffect} from 'react'
// import axios from "axios"
import jwt_decode from "jwt-decode";

export const UserContext = createContext(null)

export const UserContextProvider = ({children}) => {

    let loggedInUser 

    const userWithToken = JSON.parse(localStorage.getItem('token') || 'null')
    if (userWithToken) {
        loggedInUser = jwt_decode(userWithToken)
    }
    const [user, setUser] = useState(loggedInUser)


    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}