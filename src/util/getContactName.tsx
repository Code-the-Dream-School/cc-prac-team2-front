export const getContactName = (user, users) => {
    return users[0]._id === user.userId ? users[1].userName : users[0].userName
}