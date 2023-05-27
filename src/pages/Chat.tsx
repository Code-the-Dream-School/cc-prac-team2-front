
import {useState, useContext, useEffect, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"
import ChatContainer from "../components/ChatContainer"
import ChatWelcome from '../components/ChatWelcome';
import {UserContext} from "../context/user-context"
import { BsLockFill } from 'react-icons/bs';

const Chat = () => {

    const [user, setUser] = useContext(UserContext)
    console.log(user);

    


    return (
        <>
        
        <div className="flex h-screen">

            <div className="w-1/3 p-2 bg-slate-500">
                
            <div className="border-b border-gray-100 py-2 cursor-pointer text-center">
                Mimi
            </div>
            </div>
            <div className="flex flex-col w-2/3 bg-gray-300 p-2 ">

            <ChatWelcome />
            <ChatContainer />

            </div>

        </div>

        
        </>
    )
}

export default Chat