export const getContactName = (user:any, users:any, onlineFriends:any) => {
    let name
    if (users[0]._id === user.userId) {
        name = users[1].userName
    } else {
        name = users[0].userName
    }

    const checkUserName = (name, onlFr) => {
        return onlFr.some((o) => (
            o.userName === name 
        ))
    }

    const userNameExists = checkUserName(name,onlineFriends);

    if(users) {
        return (
        <>
        <div className="flex flex-row space-x-4 items-center">
            <div className="">{name}</div>
            {userNameExists ? (<div className="rounded-full bg-green-400 h-4 w-4"></div>): (<div className="rounded-full bg-red-400 h-4 w-4"></div>)}
        </div>
        </>
        )
    } else {
        return null
    }
}