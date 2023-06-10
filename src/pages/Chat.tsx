import {useState, useContext, useEffect, useRef} from 'react'
import axios from "axios"
import ChatContainer from "../components/ChatContainer"
import {UserContext} from "../context/user-context"
import COCKATOO from "./../assests/cockatoo.png";
import {getContactName} from "../util/getContactName"
import { io, Socket } from 'socket.io-client';

type MyEventMap = {
    connect: () => void;
    disconnect: () => void;
    "addUser": (userID: number) => void;
    "getUsers": (users: string[]) => void;
  };

interface unContactUsers {
    conversation: string[],
    _id: string,
    userName: string
}


const Chat = () => {
    const {
        user, 
        conversationId, setConversationId, 
        selectId, setSelectId
    } = useContext(UserContext)


    const socket = useRef<Socket<MyEventMap> | null>()
    const [conversations, setConversations] = useState<any[] | undefined>()
    const [uncontactedUsers, setUncontactedUsers] = useState<unContactUsers>()
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")


    useEffect(() => {
        socket.current = io("http://localhost:8000");
      }, []);

    useEffect(() => {
        if (socket.current && user) {
            socket.current.emit("addUser", user.userId);
            socket.current.on("getUsers", (users) => {
                console.log(users);
            })
        }

      }, [socket.current]);



    const fetchConversations = async () => {
        const {data} = await axios.get(`http://localhost:8000/api/v1/users/${user.userId}/conversations`, 
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setConversations(data.conversations)
    }



    const fetchUsers = async () => {
        const {data} = await axios.get(`http://localhost:8000/api/v1/users`, 
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const uncontactedUsers = data.users.uncontactedUsers

        setUncontactedUsers(uncontactedUsers)
    }
    console.log(uncontactedUsers);
    



    

    useEffect(()=>{
        fetchConversations()
        fetchUsers()
    }, [])


    const handleSelectContact = (conversation:any) => {
            setConversationId(conversation._id)
            let convUser = conversation.users
            let id
            if (convUser[0]._id === user?.userId as string) {
                id = convUser[1]._id
            } else {
                id = convUser[0]._id
            }
            setSelectId(id)
    }



    const handleSelectUnContact = (unContact: unContactUsers) => {
        setSelectId(unContact._id)
        setConversationId(null)
    }
    
    
    return (
        <>
        
        <div className="flex">
            <div className="w-80 h-screen p-2 bg-slate-400">
                <div className='text-xl p-3 text-center'>Contact
                </div>
                {conversations ? conversations.map((conversation) => {
                    return (
                        <>
                    <div 

                    key={conversation._id}
                    className={'flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer ' + (conversationId === conversation._id ?  "bg-slate-500"  : '')}
                    onClick={() => handleSelectContact(conversation)} >
                        <div className='w-1/5'>
                            <img className='w-10 h-10 rounded-full' src={COCKATOO} />
                        </div>
                    <div className="w-4/5 p-2">
                        
                    {
                    getContactName(user, conversation.users)
                    // conversation._id
                    }
                    </div>
                    </div>
                        </>
                    )
                }
        ) : null}
                        
                <div className='text-xl p-3 text-center'>People
                </div>
                <div>
                    {uncontactedUsers ? uncontactedUsers.map((unContact) => {
                    if (unContact._id === user?.userId) {return null}
                    return (
                    <>
                    <div 
                    key={unContact._id}
                    className={'flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer ' + (selectId === unContact._id ?  "bg-slate-500"  : '')}
                    onClick={() => handleSelectUnContact(unContact)}
                
                    >
                   {unContact.userName}
                    </div>
                    </>
                    )
                }): null}
                    </div>
                </div>

            <ChatContainer socket={socket}/>
            </div>
        </>
    )
}

export default Chat
=======
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import ChatWelcome from "../components/ChatWelcome";
import { UserContext } from "../context/user-context";
import COCKATOO from "./../assests/cockatoo.png";
import { getContactName } from "../util/getContactName";

const Chat = () => {
  const {
    user,
    setUser,
    conversation,
    setConversation,
    selectId,
    setSelectId,
    isDarkMode,
  } = useContext(UserContext);

  const [conversations, setConversations] = useState<any[] | undefined>();
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  const fetchConversations = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/users/${user.userId}/conversations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    setConversations(data.conversations);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelectContact = (conversation: any) => {
    setConversation(conversation._id);
    console.log(conversation.users);
    let convUser = conversation.users;
    let id;
    if (convUser[0]._id === (user?.userId as string)) {
      id = convUser[1]._id;
    } else {
      id = convUser[0]._id;
    }
    setSelectId(id);
  };

  return (
    <>
      <div className={`flex ${isDarkMode ? "bg-dark" : "bg-light"}`}>
        <div
          className={`w-80 h-screen p-2 ${
            isDarkMode ? "bg-slate-600" : "bg-slate-200"
          }`}
        >
          <div
            className={`text-xl p-3 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Contact
          </div>

          {conversations ? (
            conversations.map((conversation) => {
              return (
                <div
                  key={conversation._id}
                  className={`flex ${
                    isDarkMode ? "bg-slate-700" : "bg-slate-300"
                  } rounded-lg m-3 p-2 cursor-pointer ${
                    conversation === conversation._id ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleSelectContact(conversation)}
                >
                  <div className="w-1/5">
                    <img className="w-10 h-10 rounded-full" src={COCKATOO} />
                  </div>
                  <div className="w-4/5 p-2">
                    {getContactName(user, conversation.users)}
                  </div>
                </div>
              );
            })
          ) : (
            <ChatWelcome />
          )}
        </div>

        <ChatContainer />
      </div>
    </>
  );
};

export default Chat;