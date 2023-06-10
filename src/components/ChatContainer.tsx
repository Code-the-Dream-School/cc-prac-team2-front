
import {useState, useContext, useEffect, useRef} from 'react'
import { toast } from "react-toastify";
import axios from "axios"
import ChatInput from "../components/ChatInput"
import {UserContext} from "../context/user-context"
import ChatWelcome from '../components/ChatWelcome';
import {getTime} from "../util/getTime"
import {v4 as uuidv4} from "uuid" 

interface Messages {
    createdAt?: string | null,
    message: string, 
    sender: string | null, 
    _id: string
}

interface Socket {
    current: any;
  }


const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {

    const {
        user, setUser, 
        conversationId, setConversationId, 
        selectId, setSelectId,
        isDarkMode,
        recipient, setRecipient,
    } = useContext(UserContext)



    const [messages, setMessages] = useState<Messages[]>([])
    const [usersArray, setUsersArray] = useState()
    const [arrivalMessages, setArrivalMessages] = useState<Messages[] | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")

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
                const {users} = data.conversation
                console.log(users)
                if (users[0].userName === user?.userName) {
                    setRecipient(users[1].userName)
                } else {
                    setRecipient(users[0].userName)
                }
                setMessages(messages)
                setUsersArray(data.conversation.users)
            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching messages, please try again");
        }
    }


    useEffect(() => {
        fetchMessages()
    }, [selectId])





    const sendMessage = async (messageText:any) => {
        try {
            await axios.post('http://localhost:8000/api/v1/messages', {
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

            socket.current.emit("sendMessage", {
                from: user?.userId,
                to: selectId, 
                message: messageText
            })

            setMessages( prev => [...prev, {
                createdAt: JSON.stringify(new Date().toLocaleString()),
                message: messageText, 
                sender: user?.userId, 
                _id: uuidv4(),
            }])


        } catch (err) {
            console.log(err);
            toast.error("Error sending messages, please try again");
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("getMessage", (data:any) => {
                setArrivalMessages({
                    createdAt: JSON.stringify(new Date().toLocaleString()),
                    message: data.message, 
                    sender: data.from, 
                    _id: uuidv4(),
                })
            } )}
        
    }, [socket.current])


    const idArray = usersArray?.map((obj) => obj._id);


    useEffect(() => {
        arrivalMessages  && idArray?.includes(arrivalMessages.sender) && setMessages((prev) =>[...prev, arrivalMessages])
    }, [arrivalMessages])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth', block:'end'})
    }, [messages])


    return (
        <>
        <div
        className={`flex flex-grow flex-col shadow  ${
          isDarkMode ? "bg-gray-900" : "bg-slate-200"}`}
        >
        <div
          className={`w-full h-14 text-red-300 pt-4 cursor-pointer rounded-tl-lg shadow text-center font-medium ${
            isDarkMode ? "bg-slate-200" : "bg-gray-800" }`}
        >
            <p>{recipient}</p>
        </div>
        <div
          className={`w-full flex-grow flex flex-col ${
            isDarkMode ? "bg-gray-800" : "bg-slate-200"}`}
        >
                <div className="relative h-full">
                <div className="overflow-y-auto absolute top-0 left-0 right-0 bottom-0"> 
                {!!selectId && !!conversationId ? 
                
                    <div className='m-2 p-2'>
                    {messages ? messages.map((msg) => (

                        <div 
                        className={(msg.sender === user?.userId ? 'text-right' : 'text-left')}
                        key={msg._id}
                        >
                        <div className={('max-w-md text-left inline-block rounded-lg bg-red-300 m-2 p-2 ' + (msg.sender === user?.userId ?  "bg-white " : null)  )}>
                            {msg.message}
                        <div className='text-xxs text-gray-600 text-right items-right'>{getTime(msg.createdAt)}</div>
                        </div>
                        <div ref={scrollRef}></div>
                        </div>
                    )) : null}
                </div>
                : 
                <ChatWelcome />}
                
                </div>
                </div> 
                </div>

                <div
          className={`w-full h-20 pt-2 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
                <ChatInput onHandleSendMessage={sendMessage} />
                </div>
            </div>
        </>
    )
}

export default ChatContainer




