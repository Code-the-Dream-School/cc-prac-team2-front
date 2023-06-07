import React from 'react'
import Bird from "../assests/Bird.gif"

export default function ChatWelcome() {
  return (
    <div>
        <div className='flex justify-center items-center h-screen'>
          <div>
          <img className="m-auto" src={Bird} alt="Bird" width="80" height="80"/>
          <p>Welcome to TALCKATOO chat app!</p>
          </div>
        </div>
    </div>
  )
}
