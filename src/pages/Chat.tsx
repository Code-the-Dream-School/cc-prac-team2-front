import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
import COCKATOO from "./../assests/cockatoo.png";
import { getContactName } from "../util/getContactName";
import { io, Socket } from "socket.io-client";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
};

interface User {
    _id: string;
    userName: string;
    conversation: string;
  }

interface UsersList {
    contactedUsers: User[];
    uncontactedUsers: User[];
  }

const Chat = () => {
  const {
    user,
    conversationId,
    setConversationId,
    selectId,
    setSelectId,
    isDarkMode,
  } = useContext(UserContext);

  const socket = useRef<Socket<MyEventMap> | null>();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  console.log(user?._id);

  useEffect(() => {
    socket.current = io("http://localhost:8000");
  }, []);

  

  useEffect(() => {
    if (socket.current && user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users: unknown[]) => {
        let usersMap = new Set();
        users.map((user:any) => {
          usersMap.add(user[0]);
          let usersArray:any[] = Array.from(usersMap);
          setOnlineUsers(usersArray);
        });
      });
    }
  }, [socket.current, user]);



  useEffect(() => {
    if (usersList?.contactedUsers && usersList?.uncontactedUsers  && onlineUsers) {
      const onlContact = usersList.contactedUsers.filter((u) => onlineUsers.includes(u._id));
      const onlUnContact = usersList.uncontactedUsers.filter((u) => onlineUsers.includes(u._id));
      setOnlineFriends([...onlContact, ...onlUnContact]);
    }
  }, [onlineUsers, usersList?.contactedUsers, usersList?.uncontactedUsers]);



  const fetchUsers = async () => {
    const { data } = await axios.get(`http://localhost:8000/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    
    setUsersList(data.users)
  };



  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectContact = (u: User) => {
    setConversationId(u.conversation);
    setSelectId(u._id);
  };

  const handleSelectUnContact = (unContact:User) => {
    setConversationId(null);
    setSelectId(unContact._id);
  };

  return (
    <>
      <div className={`flex flex-grow ${isDarkMode ? "bg-dark" : "bg-light"}`}>
        <div
          className={`w-70 p-2 ${isDarkMode ? "bg-slate-600" : "bg-slate-200"}`}
        >
          <div
            className={`text-xl p-3 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Contact
          </div>
          {usersList ? usersList.contactedUsers.map((u) => {
            return (
                <div key={u._id}
                className={
                    "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer " +
                    (conversationId === u.conversation
                    ? "bg-slate-500"
                    : "")
                }
                onClick={() => handleSelectContact(u)}
                >
                <div className="w-1/5">
                    <img
                    className="w-10 h-10 rounded-full"
                    src={u.profileImage?.url}
                    />
                </div>
                <div className="w-4/5 p-2">
                    {getContactName(u.userName, onlineFriends )}
                </div>
                </div>
            );
            }) : null }
          <div
            className={`text-xl p-3 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            People
          </div>
          <div>
            {usersList
              ? usersList.uncontactedUsers.map((unContact) => {
                  if (unContact._id === user?._id) {
                    return null;
                  }
                  return (
           
                      <div key={unContact._id}
                        className={
                          "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer " +
                          (selectId === unContact._id ? "bg-slate-500" : "")
                        }
                        onClick={() => handleSelectUnContact(unContact)}
                      >
                        <div className="items-center text-center justify-between">
                          {getContactName(unContact.userName, onlineFriends )}
                        </div>
                      </div>
                 
                  );
                })
              : null}
          </div>
        </div>

        <ChatContainer socket={socket} />
      </div>
    </>
  );
};

export default Chat;
