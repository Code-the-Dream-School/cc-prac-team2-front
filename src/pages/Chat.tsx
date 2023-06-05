
import {useState, useContext, useEffect} from 'react'
import axios from "axios"
import ChatContainer from "../components/ChatContainer"
import ChatWelcome from '../components/ChatWelcome';
import {UserContext} from "../context/user-context"
import COCKATOO from "./../assests/cockatoo.png";
import {getContactName} from "../util/getContactName"


const Chat = () => {
    const {
        user, setUser, 
        conversation, setConversation, 
        selectId, setSelectId
    } = useContext(UserContext)

    const [conversations, setConversations] = useState<any[] | undefined>()
    const [uncontactedUsers, setUncontactedUsers] = useState<any[] | undefined>()
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")

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

console.log(conversations);

    

    useEffect(()=>{
        fetchConversations()
        fetchUsers()
    }, [])


    const handleSelectContact = (conversation:any) => {
            setConversation(conversation._id)
            console.log(conversation.users);
            let convUser = conversation.users
            let id
            if (convUser[0]._id === user?.userId as string) {
                id = convUser[1]._id
            } else {
                id = convUser[0]._id
            }
            setSelectId(id)
    }


    const handleSelectUnContact = (unContact) => {
        console.log("click");
        console.log(unContact._id);
        setSelectId(unContact._id)
    
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
                    className={'flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer ' + (conversation === conversation._id ?  "text-yellow-400"  : '')}
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
                    className='flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer '
                    onClick={() => handleSelectUnContact(unContact)}
                    >
                   {unContact.userName}
                    </div>
                    </>
                    )
                }): null}
                    </div>
                </div>

            <ChatContainer />
            </div>
     


        
        </>
    )
}

export default Chat