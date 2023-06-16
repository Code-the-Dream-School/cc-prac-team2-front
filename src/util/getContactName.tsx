export const getContactName = (userName:any, onlineFriends:any) => {

    const checkUserName = (userName, onlFr) => {
        return onlFr.some((o) => (
            o.userName === userName 
        ))
    }

    
    const userNameExists = checkUserName(userName,onlineFriends);
    console.log(userNameExists)
 
    if(userName) {
        return (
        <>
        <div className="flex flex-row space-x-4 items-center">
            <div className="">{userName}</div>
            {userNameExists ? (<div className="rounded-full bg-green-400 h-4 w-4"></div>): (<div className="rounded-full bg-red-400 h-4 w-4"></div>)}
        </div>
        </>
        )
    } else {
        return null
    }
}