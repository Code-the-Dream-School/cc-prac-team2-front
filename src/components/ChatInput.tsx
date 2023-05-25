
import {useState, useContext, useEffect, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios"
import EmojiPicker from 'emoji-picker-react'
import {BsEmojiSmile} from 'react-icons/bs'
import { MdOutlineClose } from 'react-icons/md'


const ChatInput = () => {

    const [showEmoji, setShowEmoji] = useState<boolean>(false)
    const [messageText, setMessageText] = useState<string>("")

    const handleShowEmoji = () => {
        setShowEmoji(!showEmoji)
    }

    const handleEmojiclick = (event: any) =>
    setMessageText(`${messageText} ${event.emoji}`)



    return (

        <>
        <div>
            <form className='flex gap-2 items-center'>
            <div className="m-auto" onClick={handleShowEmoji}>
        {!showEmoji ? (
          <span className="cursor-pointer">
            <BsEmojiSmile />
          </span>
        ) : (
          <div className="absolute left-100 top-28 h-10 w-10">
            <span
              className="flex items-center justify-end cursor-pointer"
              onClick={handleShowEmoji}
            >
              <MdOutlineClose />
            </span>
            <EmojiPicker onEmojiClick={handleEmojiclick} />
          </div>
        )}
      </div>
            <input
            type="text"
            placeholder='Type your message'
            className="border flex-grow bg-slate-800 rounded-xl p-2 text-white"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            />
            <button type="submit" className="bg-slate-800 p-2 text-slate-400 rounded-xl ease-in-out duration-300 hover:bg-slate-500"> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            </button>
            </form>

        </div>

        
        </>
    )
}

export default ChatInput