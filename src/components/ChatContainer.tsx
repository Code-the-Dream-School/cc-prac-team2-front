
import {useState, useContext, useEffect, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"
import ChatInput from "../components/ChatInput"

const ChatContainer = () => {

    const scrollRef = useRef<HTMLDivElement | null>(null)

    return (
        <>
            <div className="flex-grow">
            <div className="relative h-full">
                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2"> 
                <div className=''>
                </div>
                <div ref={scrollRef}></div>
                </div>
            </div>
            </div>
            <ChatInput />
        
        </>
    )
}

export default ChatContainer