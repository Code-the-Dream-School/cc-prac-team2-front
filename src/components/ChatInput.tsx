import {useState,ChangeEvent, useContext} from 'react'
import EmojiPicker from 'emoji-picker-react'
import {BsEmojiSmile} from 'react-icons/bs'
import { MdOutlineClose } from 'react-icons/md'
import VoiceMessage from './VoiceMessage'
import SpeechToText from './SpeechToText'
import {UserContext} from "../context/user-context"

interface ChatInputProps {
  onHandleSendMessage: (message: string) => void,
  onHandleSendAIMessage: (messageAI: string) => void,
  socket: any
}
const ChatInput = ({onHandleSendMessage, socket, onHandleSendAIMessage}: ChatInputProps): JSX.Element => {

    const [showEmoji, setShowEmoji] = useState<boolean>(false)
    const [messageText, setMessageText] = useState<string>("")
    const {setIsLoading} = useContext(UserContext)

    const handleShowEmoji = () => {
        setShowEmoji(!showEmoji)
    }

    const handleEmojiClick = (event: any) =>
    setMessageText(`${messageText} ${event.emoji}`)

    const handleSendMessage = (e:ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (messageText.substring(0,7) === "hey gpt") {
        onHandleSendAIMessage(messageText)
        setIsLoading(true)
      } else {
        onHandleSendMessage(messageText)
      }
      setMessageText("")
    }


    

    return (
        <>
        <div className="flex flex-col">
          <div className="h-2/3">
            <form 
            onSubmit={handleSendMessage}
            className='flex flex-row'>
              <div className="m-auto pl-6" onClick={handleShowEmoji}>
                {!showEmoji ? (
                  <span className="cursor-pointer">
                    <BsEmojiSmile />
                  </span>
                ) : (
                  <div className="absolute left-100 top-28 h-12 w-12">
                    <span
                      className="flex items-center justify-end cursor-pointer"
                      onClick={handleShowEmoji}
                    >
                      <MdOutlineClose />
                    </span>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>

              <input
              type="text"
              placeholder='Type your message'
              className={`mx-8 flex-grow bg-slate-800 rounded-xl p-2 text-white hover:border-white focus:border-white shadow-lg ${
                messageText.startsWith('hey gpt') ? 'text-yellow-300' : ''
              }`}
              value={messageText}
              onChange={e => 
                {
                  setMessageText(e.target.value)
                }
              }
              />
              <button 
              type="submit" 
              className="bg-slate-800  text-slate-400 mr-6 my-2 w-10 h-10 rounded-lg flex items-center justify-center ease-in-out duration-300 hover:bg-slate-500"> 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="items-center justify-center w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              </button>
            </form>
            </div>
      

          <div className="h-1/3">
            <div className='flex flex-row'>
   
            <div className="w-1/2 my-2 mx-8 text-center justify-between">
                  <SpeechToText  setMessageText={setMessageText}/>
            </div>
            <div className="w-1/2 my-2 mx-8 text-center justify-between">
                  <VoiceMessage socket={socket}/>
            </div>
          
            </div>
          </div>

        </div>
        </>
    )
}

export default ChatInput
