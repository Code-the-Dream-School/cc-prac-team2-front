
import {useState, useContext, useEffect, useRef} from 'react'
import { toast } from "react-toastify";
import axios from "axios"
import ChatInput from "../components/ChatInput"
import {UserContext} from "../context/user-context"
import { io, Socket } from 'socket.io-client';
import ChatWelcome from '../components/ChatWelcome';

import {getTime} from "../util/getTime"

interface Messages {
    _id: string,
    sender: string
    message: string,
}

const ChatContainer = ({socket}): JSX.Element => {
    const {
        user, setUser, 
        conversationId, setConversationId, 
        selectId, setSelectId
    } = useContext(UserContext)

    const [messages, setMessages] = useState<Messages[]>([])

 
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")

console.log(user);



    const sendMessage = async (messageText:any) => {
        try {
            const {data} = await axios.post('http://localhost:8000/api/v1/messages', {
                from: user?.userId,
                to: selectId, 
                message: messageText
            },
            {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
            setMessages( prev => [...prev, {
                from: user.userId,
                to: selectId, 
                message: messageText
            }])






        } catch (err) {
            console.log(err);
            toast.error("Error sending messages, please try again");
        }
    }

    console.log(messages);
    

    const fetchMessages = async () => {
        try {
            if (conversationId) {
                const {data} = await axios.get(`http://localhost:8000/api/v1/users/${user.userId}/conversations/${conversationId}`, 
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
                const {messages} = data.conversation
                setMessages(messages)
            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching messages, please try again");
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [conversationId])


    return (
        <>

            <div className="flex-grow h-screen bg-slate-200">
                <div className="w-full h-5/6 bg-blue-100" > 
                <div className="relative h-full">
                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2"> 
                {!!selectId && !!conversationId ? 
                
                    <div className=''>
                    {messages ? messages.map((msg) => (

                        <div 
                        className={(msg.sender === user?.userId ? 'text-right' : 'text-left')}
                        key={msg._id}
                        >
                        <div className={('max-w-md text-left inline-block rounded-lg bg-white m-2 p-2 ' + (msg.sender === user?.userId ? 'bg-yellow-400' : null) )}>
                            {msg.message}
                        <div className='text-xxs text-gray-600 text-right items-right'>{getTime(msg.createdAt)}</div>
                        </div>
             
                        </div>
                    )) : null}
                </div>
    
                : 
                <ChatWelcome />}


                <div ref={scrollRef}></div>
                </div>
                </div> 
                </div>
                <div className="w-full h-1/6 bg-slate-300" >   
                <ChatInput onHandleSendMessage={sendMessage} />
                </div>
  
            </div>
            
        
        </>
    )
}

export default ChatContainer




