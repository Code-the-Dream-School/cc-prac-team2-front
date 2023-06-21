export const getContactName = (userName:any, onlineFriends:any) => {

    const checkUserName = (userName, onlFr) => {
        return onlFr.some((o) => (
            o.userName === userName 
        ))
    }


    
    const userNameExists = checkUserName(userName,onlineFriends);

 
    if(userName) {
        return (
        <>
        {userNameExists ? 
        (<div className="absolute bottom-0 right-0 rounded-full bg-green-400 h-3 w-3"></div>): 
        (<div className="absolute bottom-0 right-0 rounded-full bg-gray-600 h-3 w-3"></div>)}
        </>
        )
    } else {
        return null
    }
}