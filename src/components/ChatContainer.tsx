import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";
import ChatWelcome from "../components/ChatWelcome";
import { getTime } from "../util/getTime";
import { v4 as uuidv4 } from "uuid";


interface Socket {
  current: any;
}

const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {

    const {
        user, 
        conversationId, 
        selectId, 
        isDarkMode,
        recipient, setRecipient,
        messages, setMessages,
        isLoading, setIsLoading,
    } = useContext(UserContext)


    const [usersArray, setUsersArray] = useState([])
    const [arrivalMessages, setArrivalMessages] = useState(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")
    const idArray = usersArray?.map((obj) => obj._id);
    const AI_ASSISTANT_ID= "6487be19c6c6a7054bb52072"


    const fetchMessages = async () => {
        try {
            if (user && conversationId) {
                const {data} = await axios.get(`http://localhost:8000/api/v1/users/${user._id}/conversations/${conversationId}`, 
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
                console.log(data);
                
                const {messages} = data.conversation
                const {users} = data.conversation
                if (users[0].userName === user?.userName) {
                    setRecipient(users[1].userName)
                } else {
                    setRecipient(users[0].userName)
                }
                setMessages(messages)
                const AIuser = {
                  userName: "AI Assistant",
                  _id: AI_ASSISTANT_ID
                }
                setUsersArray([...data.conversation.users, AIuser])

            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching messages, please try again");
        }
    }


  useEffect(() => {
    fetchMessages();
  }, [selectId]);

    const sendAIMessage = (messageAI: any) => {


        socket.current.emit("sendMessageChatGPT", {
            message: messageAI, 
            from: user?._id,
            to: selectId, 
            createdAt: Date.now()
        })

        setMessages( prev => [...prev, {
            createdAt: Date.now(),
            message: messageAI, 
            sender: user?._id, 
            _id: uuidv4(),
        }])
    }


    const sendMessage = async (messageText:any) => {
        try {
           const {data} = await axios.post('http://localhost:8000/api/v1/messages', {
                from: user?._id,
                to: selectId, 
                message: messageText
            },
            {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
            const {message} = data

            socket.current.emit("sendMessage", {
                createdAt: message.createdAt,
                from: user?._id,
                to: selectId, 
                message: messageText
            })

            setMessages( prev => [...prev, {
                createdAt: message.createdAt,
                message: messageText, 
                sender: user?._id, 
                _id: message._id,
            }])


        } catch (err) {
            console.log(err);
            toast.error("Error sending messages, please try again");
        }
    }


    useEffect(() => {
        if (socket.current) {
            socket.current.on("getMessage", (data:any) => {
                console.log(data)
                if(data.message) {
                    setArrivalMessages({
                        createdAt: data.createdAt,
                        message: data.message , 
                        sender: data.from, 
                        _id: uuidv4(),
                    })
                } else if (data.voiceNote) {
                    setArrivalMessages({
                        createdAt: data.createdAt,
                        voiceNote: {
                            url: data.voiceNote.url
                        }, 
                        sender: data.from, 
                        _id: uuidv4(),
                    })
                } else if (data.messageReply) {
                    setIsLoading(false)
                    setArrivalMessages({
                        createdAt: data.messageReply.createdAt,
                        message: data.messageReply.message, 
                        sender: data.messageReply.sender, 
                        _id: uuidv4(),
                    })
                }
            } )}
        
    }, [socket.current, arrivalMessages])

    

    useEffect(() => {
        arrivalMessages  
        && idArray?.includes(arrivalMessages.sender) 
        && setMessages((prev) =>[...prev, arrivalMessages])
    }, [arrivalMessages])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <>
      <div
        className={`flex flex-grow flex-col shadow  ${
          isDarkMode ? "bg-gray-900" : "bg-slate-200"
        }`}
      >
        <div
          className={`w-full h-14 text-black pt-4 cursor-pointer rounded-tl-lg shadow text-center font-medium border-b-2 border-slate-300 ${
            isDarkMode ? "bg-slate-200" : "bg-slate-200"
          }`}
        >

          <p>{recipient}</p>
        </div>
        <div
          className={`w-full flex-grow flex flex-col ${
            isDarkMode ? "bg-gray-800" : "bg-slate-200"
          }`}
        >
                <div className="relative h-full">
                <div className="overflow-y-auto absolute top-0 left-0 right-0 bottom-0"> 
                {!!selectId ? (
                
                    <div className='m-2 p-2'>
                    {messages ? messages.map((msg) => (
        
                        <div 
                        className={('text-left ' +
                        (msg.sender === user?._id || msg.sender ===  AI_ASSISTANT_ID && msg.message.startsWith('hey gpt') ? 'text-center ' : '') +
                        (msg.sender !== user?._id ? 'text-left ' : 'text-right ')
                      )}
                        key={msg._id}
                        >
                        <div className={('max-w-md text-left inline-block rounded-lg bg-slate-500 m-2 p-2 ' + 
                            (msg.sender === AI_ASSISTANT_ID ? 'bg-red-300 ' : '') +
                            (msg.sender === user?._id ? 'bg-white ' : '')
                        
                        )}>

                        {msg.message && msg.message.includes('\n') ? (
                msg.message.split('\n').map((line, index, lines) => {
                  console.log(lines[0]);
                  console.log(lines[1])
                  console.log(lines[0] === lines[1])
                  const prevLine = index > 0 ? lines[index - 1] : null;
                  console.log(prevLine);
                  const isFirstLine = index === 0 || line !== prevLine;
                  
                  return (
                    <React.Fragment key={index}>
                      {isFirstLine && line}
                      {isFirstLine && index !== lines.length - 1 && (
                        <>
                        {line !== lines[index + 1] && 
                        (
                          <>
                          <br />
                          <img width="15" height="15" src="https://img.icons8.com/ios-glyphs/30/right3.png" alt="right3" />                         
                          </>
                        )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })
                        ) : (
                          <>{msg.message}</>
                        )}
                                
                        <div className='text-xxs text-gray-600 text-right items-right'>{getTime(msg.createdAt)}</div>
                       {msg.voiceNote && (
                        <audio className="w-60 h-15" controls>
                        <source src={msg.voiceNote?.url} type="audio/mpeg" />
                        </audio>)
                        }
                        </div>
                        <div ref={scrollRef}></div>
                        </div>
                    )) : null}
                    {isLoading ?
                    <div className='items-center text-center justify-between'>
                        <div aria-label="Loading..." role="status" className="flex items-center space-x-2"><svg className="h-6 w-6 animate-spin stroke-gray-500" viewBox="0 0 256 256"><line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg><span className="text-xs font-medium text-gray-500">Loading...</span></div>
                    </div>
                    : null}
                </div>
              ) : (
                <ChatWelcome />
              )}
            </div>
          </div>
        </div>

                <div
          className={`w-full h-24 pt-2 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
            {selectId ? (
                <>
                <ChatInput 
                onHandleSendMessage={sendMessage} 
                onHandleSendAIMessage={sendAIMessage}
                socket={socket}/>
            
                </>
                
            ) : null}
                </div>
            </div>
        </>
    )
}

export default ChatContainer


