import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";
import ChatWelcome from "../components/ChatWelcome";
import { getTime } from "../util/getTime";
import { v4 as uuidv4 } from "uuid";
import JumpingDotsAnimation from "../UI/animation"

interface Socket {
  current: any;
}

const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {

    const {
        user, 
        conversationId, 
        setConversationId,
        selectId, 
        isDarkMode,
        recipient, setRecipient,
        messages, setMessages,
        isLoading, setIsLoading,
        language, 
    } = useContext(UserContext)


    const [usersArray, setUsersArray] = useState([])
    const [arrivalMessages, setArrivalMessages] = useState(null)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [selectedTyping, setSelectedTyping] = useState()
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")
    const idArray = usersArray?.map((obj) => obj._id)


    const fetchMessages = async () => {
        try {
            if (user && !!conversationId) {
                const {data} = await axios.get(`${import.meta.env.VITE_USERS_URL}/${user._id}/conversations/${conversationId}`, 
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
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
                  _id: import.meta.env.VITE_AI_ASSISTANT_ID
                }
                setUsersArray([...data.conversation.users, AIuser])

            }
        } catch (err) {
            toast.error("Error fetching messages, please try again");
        }
    }



  useEffect(() => {
    if (socket.current) {
      socket.current.on("isTyping", (data:any) => {
        setSelectedTyping(data)
        setIsTyping(true)
      }
      );
      socket.current.on("stopTyping", () => setIsTyping(false));
    }
  }, [socket.current]);



  useEffect(() => {
    fetchMessages();    
  }, [selectId, conversationId]);


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

        socket.current.emit("stopTyping", selectId)
        if (selectId && conversationId) {
       
          try {

            const {data} = await axios.post(`${import.meta.env.VITE_MESSAGES_URL}`, {
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
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
                 targetLanguage: language,
                 message: message.message
             })
 
             setMessages( prev => [...prev, {
                 createdAt: message.createdAt,
                 message: message.message, 
                 sender: user?._id, 
                 _id: message._id,
             }])
 
 
         } catch (err) {
             toast.error("Error sending messages, please try again");
         }
        } else if (selectId && conversationId === null) {
          setMessages([])
          try {
            const {data} = await axios.post(`${import.meta.env.VITE_MESSAGES_URL}`, {
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
                 message: messageText
             },
             {
                 headers: {
                   Authorization: `Bearer ${token}`
                 }
               }
             )
             const {message} = data
             if(data.conversation._id){
               setConversationId(data.conversation._id)
             }

            
             socket.current.emit("sendMessage", {
                 createdAt: message.createdAt,
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
                 message: message.message
             })
 
         } 
         
         
         catch (err) {
             toast.error("Error sending messages, please try again");
         }
        }
    }

    


    useEffect(() => {
        if (socket.current) {
            socket.current.on("getMessage", (data:any) => {
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
          isDarkMode ? "bg-slate-800" : "bg-slate-200"
        }`}
      >
        <div
          className={`w-full h-14 text-black pt-4 cursor-pointer rounded-tl-lg shadow text-center font-medium border-b-2 border-slate-300 ${
            isDarkMode ? "bg-gray-800 text-white border-gray-900" : "bg-slate-200"
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
                {!!selectId && !!conversationId ? (
                
                    <div className='m-2 p-2'>
                    {messages ? messages.map((msg) => (
        
                        <div 
                        className={('text-left ' +
                        (msg.sender === user?._id ? 'text-right '  : '') +
                        (msg.sender == import.meta.env.VITE_AI_ASSISTANT_ID ?  'text-center' : '') 
                      )}
                        key={msg._id}
                        >
                        <div 
                      className={('max-w-md inline-block  rounded-lg m-2 p-2 ' +
                      (msg.sender === user?._id ? 'bg-[#f8fafc] text-left ' : '') +
                      (msg.sender == import.meta.env.VITE_AI_ASSISTANT_ID ?  'bg-yellow-100 text-center' : 'bg-[#94a3b8]') 
                      
                    )}
                        >
                       {msg.sender !== import.meta.env.VITE_AI_ASSISTANT_ID && msg.message && msg.message.includes("\n") ? (
                        msg.message.split("\n").map((line, index, lines) => {
                          const prevLine = index > 0 ? lines[index - 1] : null;
                          const isFirstLine = index === 0 || line !== prevLine;
                          
                          return (
                            <React.Fragment key={index}>
                              {isFirstLine && line}
                              {isFirstLine && index !== lines.length - 1 && line !== lines[index + 1] && (
                                <>
                                  <br />
                                  <img width="15" height="15" src="https://img.icons8.com/ios-glyphs/30/right3.png" alt="right3" />                         
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
                 
                </div>
              ) : (
                <ChatWelcome />
              )}
                {isLoading ?
                <div className='flex items-center text-center justify-center'>
                    <div aria-label="Loading..." role="status" className="flex items-center space-x-2"><svg className="h-10 w-10 animate-spin stroke-gray-500" viewBox="0 0 256 256"><line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg><span className="text-xs font-medium text-gray-500">Loading...</span></div>
                </div>
                : null}
            </div>
          </div>
        </div>
        {selectedTyping?.to === user?._id 
        && selectedTyping?.from === selectId 
        && isTyping ? <JumpingDotsAnimation /> : null}
                <div
          className={`w-full h-30 py-2 ${
            isDarkMode ? "bg-gray-800" : "bg-slate-200"
          }`}
        >
       
            {selectId ? (
                <>
                <ChatInput 
                onHandleSendMessage={sendMessage} 
                onHandleSendAIMessage={sendAIMessage}
                socket={socket}
                typing={typing}
                setTyping={setTyping}
                isTyping={isTyping}
                setIsTyping={setIsTyping}
                />
                </>
            ) : null}
                </div>
            </div>
        </>
    )
}

export default ChatContainer


