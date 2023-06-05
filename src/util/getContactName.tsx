export const getContactName = (user:any, users:any) => {
    if(users) {
        return users[0]._id === user.userId ? users[1].userName : users[0].userName
    } else {
        return null
    }
}