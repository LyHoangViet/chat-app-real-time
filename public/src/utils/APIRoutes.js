export const host = process.env.REACT_APP_API_URL;
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const deleteMessageRoute = `${host}/api/messages/delete`;
export const setUserRoute = `${host}/api/auth/setuser`;
// Thêm dòng này vào cuối file, sau các route hiện có
export const clearChatRoute = `${host}/api/messages/clear-chat`;
