import { BsCheck } from "react-icons/bs";
import { MdNightsStay } from "react-icons/md";
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
        (<button className="absolute bottom-0 right-0 rounded-full bg-green-400 h-3.5 w-3.5">
        <BsCheck/>
        </button>): 
        (<button className="absolute bottom-0 right-0 rounded-full bg-white h-3.5 w-3.5">
        <MdNightsStay/>
        </button>)}
        </>
        )
    } else {
        return null
    }
}