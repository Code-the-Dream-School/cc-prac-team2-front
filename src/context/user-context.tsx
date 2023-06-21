import React, { createContext, useState, ReactNode, useEffect, } from "react";
import axios from "axios"
import jwt_decode from "jwt-decode";

export interface Messages {
    createdAt?: number,
    message: any, 
    audioURL?: string, // URL of the audio file
    sender: string, 
    _id: string,
    voiceNote?: any //TODO refine
}

export interface User {
    email: string,
    userId: string,
    userName: string,
    _id: string
}


export interface UserContextProviderProps {
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
    messages: Messages[]; // Update the type of messages to an array of Messages or null
    setMessages: React.Dispatch<React.SetStateAction<Messages[]>>; // Update the type of setMessages
    isLoading: boolean, 
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
    messages: [], 
    setMessages: () => {},
    isLoading: false, 
    setIsLoading: () => {},
})


export const UserContextProvider:React.FC<{children: ReactNode}> = ({children}) => {

    let loggedInUser: User| null
    let loggedInUserId!: string


    const userWithToken = JSON.parse(localStorage.getItem('token') || 'null')
    if (userWithToken) {
        loggedInUser = jwt_decode(userWithToken)
        if(loggedInUser){
            loggedInUserId = loggedInUser.userId
        }
    } else {
        loggedInUser  = null
    }
    const [user, setUser] = useState<User| null>()
    const [recipient, setRecipient] = useState<string | null>(null)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [conversationId, setConversationId] = useState<string|null>(null)
    const [selectId, setSelectId] = useState<string|null>(null)
    const [messages, setMessages] = useState<Messages[]>([])
    const [isLoading, setIsLoading] = useState(false)

    console.log(loggedInUser);

    const fetchUser = async () => {
        const { data } = await axios.get(`http://localhost:8000/api/v1/users/${loggedInUserId}`, {
            headers: {
            Authorization: `Bearer ${userWithToken}`,
            },
        });
        setUser(data.user)
    };

    useEffect(()=>{
        fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    


    return (
        <UserContext.Provider
        //TODO look into user, setUser
        value={{user, setUser, 
            conversationId, setConversationId, 
            selectId, setSelectId, 
            isDarkMode, setIsDarkMode,
            recipient, setRecipient,
            messages, setMessages,
            isLoading, setIsLoading,
        }}
            >
            {children}
        </UserContext.Provider>
    )
}
