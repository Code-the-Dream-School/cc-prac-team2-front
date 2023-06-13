import React, { createContext, useState, ReactNode, useEffect, useRef } from "react";
// import axios from "axios"
import jwt_decode from "jwt-decode";

interface Messages {
    createdAt?: string | null,
    message: string, 
    audioURL: string, // URL of the audio file
    sender: string | null, 
    _id: string
}

interface User {
    email: string,
    userId: string,
    userName: string
}


interface UserContextProviderProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    recipient: string | null, 
    setRecipient: React.Dispatch<React.SetStateAction<string | null>>;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    conversationId: string | null,
    setConversationId: React.Dispatch<React.SetStateAction<string | null>>
    selectId: string | null, 
    setSelectId: React.Dispatch<React.SetStateAction<string | null>>
    messages: Messages[] | null; // Update the type of messages to an array of Messages or null
    setMessages: React.Dispatch<React.SetStateAction<Messages[] | null>>; // Update the type of setMessages
}

export const UserContext= createContext<UserContextProviderProps> ({
    user: null,
    setUser: () => {},
    recipient: null, 
    setRecipient: () => {},
    isDarkMode: false,
    setIsDarkMode: () => {},
    conversationId: null,
    setConversationId: () => {},
    selectId: null, 
    setSelectId: () => {},
    messages: null, 
    setMessages: () => {},
})


export const UserContextProvider:React.FC<{children: ReactNode}> = ({children}) => {

    let loggedInUser: User| null

    const userWithToken = JSON.parse(localStorage.getItem('token') || 'null')
    if (userWithToken) {
        loggedInUser = jwt_decode(userWithToken)
    } else {
        loggedInUser  = null
    }
    const [user, setUser] = useState<User | null>(loggedInUser)
    const [recipient, setRecipient] = useState<string | null>(null)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [conversationId, setConversationId] = useState<string|null>(null)
    const [selectId, setSelectId] = useState<string|null>(null)
    const [messages, setMessages] = useState<Messages[] | null>([])

    console.log(user);
    


    return (
        <UserContext.Provider 
        value={{user, setUser, 
            conversationId, setConversationId, 
            selectId, setSelectId, 
            isDarkMode, setIsDarkMode,
            recipient, setRecipient,
            messages, setMessages,
        }}
            >
            {children}
        </UserContext.Provider>
    )
}
