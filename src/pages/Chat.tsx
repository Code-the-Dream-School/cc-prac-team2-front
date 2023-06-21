import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
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
    profileImage: {
      url: string
    }
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
    setRecipient,
  } = useContext(UserContext);

  const socket = useRef<Socket<MyEventMap> | null>();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );
console.log(usersList)

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET}`);
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
    const { data } = await axios.get(`${import.meta.env.VITE_USERS_URL}`, {
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
    setConversationId(u.conversation._id);
    setSelectId(u._id);
  };

  const handleSelectUnContact = (unContact:User) => {
    setConversationId(null);
    setSelectId(unContact._id);
    setRecipient(unContact.userName)
  };

  return (
    <>
      <div className={`flex flex-grow ${isDarkMode ? "bg-dark" : "bg-light"}`}>
        <div
          className={`w-56 p-2 ${isDarkMode ? "bg-slate-600" : "bg-slate-200"}`}
        >
          <div
            className={`text-xl p-3 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Friends
          </div>
          {usersList ? usersList.contactedUsers.map((u) => {
            return (
                <div key={u._id}
                className={
                    "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer " +
                    (conversationId === u.conversation._id
                    ? "bg-slate-500"
                    : "")
                }
                onClick={() => handleSelectContact(u)}
                >
                <div className="flex flex-row gap-4">
                <div className="h-full w-1/3 items-center justify-between">
                  <div className="relative">
                    <img
                    className="w-12 h-10 rounded-full shadow-xl"
                    src={u.profileImage?.url}
                    />
                    {getContactName(u.userName, onlineFriends )}
                  </div>
                  </div>
                  <div className="h-full w-2/3 items-center justify-center">
                    <div className="m-auto text-center items-center justify-center">{u.userName}</div>
                  </div>
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
                         <div className="flex flex-row gap-4">
                <div className="h-full w-1/3 items-center justify-between">
                  <div className="relative">
                    <img
                    className="w-12 h-12 rounded-full border-2 shadow-sm"
                    src={unContact.profileImage?.url}
                    />
                    {getContactName(unContact.userName, onlineFriends )}
                  </div>
                  </div>
                  <div className="h-full w-2/3 items-center justify-center">
                    <div className="m-auto text-center items-center justify-center">{unContact.userName}</div>
                  </div>
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
