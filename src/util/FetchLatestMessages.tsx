import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/user-context";
import axios from "axios";
import { toast } from "react-toastify";

interface FetchLatestMessagesProps {
  _id: string;
  userName: string;
  conversation: {
    createdAt: string,
    updatedAt: string,
    _id: string,
  };
  profileImage: {
    url: string
  };
  language: string;

}


const FetchLatestMessages:React.FC<FetchLatestMessagesProps> = ({u}) => {
  console.log(u)

  const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")
  const [latestMessage, setLatestMessage] = useState("")
  const {
    user, 
} = useContext(UserContext)



  useEffect(() => {
    const getMessages = async () => {
      try {
          if (user && u._id) {
              const {data} = await axios.get(`${import.meta.env.VITE_USERS_URL}/${user._id}/conversations/${u.conversation._id}`, 
              {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
              const messages = data.conversation.messages
              const lastMess = messages[messages.length -1]
              let truncateText
              if(lastMess && lastMess.message) {
                truncateText = lastMess.message.substring(0,20)
                if (lastMess.message.length > 20){
                  truncateText = truncateText + "..."
                }
              }
              if (truncateText) {
                setLatestMessage(truncateText) 
              }
            } 
          } catch (err) {
            toast.error("Error fetching messages, please try again");
          }
        }
        getMessages()
      }, [])
      

  return (
    <div>{latestMessage}</div>
  )
}

export default FetchLatestMessages