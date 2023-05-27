import React, {createContext, useState, ReactNode, useEffect} from 'react'
// import axios from "axios"

export const UserContext = createContext(null)

export const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null)


    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
        
    )

}