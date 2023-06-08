import { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";

interface Messages {
  _id: string;
  sender: string;
  message: string;
}

const ChatContainer = (): JSX.Element => {
  const {
    user,
    setUser,
    conversation,
    setConversation,
    selectId,
    setSelectId,
    isDarkMode,
  } = useContext(UserContext);

  const [messages, setMessages] = useState<Messages[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  const sendMessage = async (messageText: any) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/messages",
        {
          from: user?.userId,
          to: selectId,
          message: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [
        ...prev,
        {
          from: user.userId,
          to: selectId,
          message: messageText,
        },
      ]);
    } catch (err) {
      console.log(err);
      toast.error("Error sending messages, please try again");
    }
  };

  const fetchMessages = async () => {
    try {
      if (conversation) {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/users/${user.userId}/conversations/${conversation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { messages } = data.conversation;
        setMessages(messages);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error fetching messages, please try again");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversation]);

  return (
    <>
      <div
        className={`flex-grow h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
        style={{ borderLeft: "2px solid #000" }}
      >
        <div
          className={`w-full h-5/6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div className="relative h-full">
            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
              <div className="">
                {messages
                  ? messages.map((msg) => (
                      <div
                        className={
                          msg.sender === user?.userId
                            ? "text-right"
                            : "text-left"
                        }
                        key={msg._id}
                      >
                        <div
                          className={`max-w-md text-left inline-block rounded-lg ${
                            isDarkMode ? "bg-gray-500 text-white" : "bg-white"
                          } m-2 p-2`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
              <div ref={scrollRef}></div>
            </div>
          </div>
        </div>
        <div
          className={`w-full h-1/6 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          <ChatInput onHandleSendMessage={sendMessage} />
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
