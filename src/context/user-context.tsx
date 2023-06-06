import React, { createContext, useState, ReactNode, useEffect, useRef } from "react";
// import axios from "axios"
import jwt_decode from "jwt-decode";
import { Socket } from "dgram";

interface UserContextProviderProps {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    conversationId: number | null,
    setConversationId: React.Dispatch<React.SetStateAction<number | null>>
    selectId: number | null, 
    setSelectId: React.Dispatch<React.SetStateAction<number | null>>

}

export const UserContext= createContext<UserContextProviderProps> ({
    user: null,
    setUser: () => {},
    conversationId: null,
    setConversationId: () => {},
    selectId: null, 
    setSelectId: () => {}
})


export const UserContextProvider:React.FC<{children: ReactNode}> = ({children}) => {

    let loggedInUser: string | null

    const userWithToken = JSON.parse(localStorage.getItem('token') || 'null')
    if (userWithToken) {
        loggedInUser = jwt_decode(userWithToken)
    } else {
        loggedInUser  = null
    }
    const [user, setUser] = useState<string | null>(loggedInUser)
    const [conversationId, setConversationId] = useState<number|null>(null)
    const [selectId, setSelectId] = useState<number|null>(null)
 


    return (
        <UserContext.Provider value={{user, setUser, conversationId, setConversationId, selectId, setSelectId}}>
            {children}
        </UserContext.Provider>
    )
}
