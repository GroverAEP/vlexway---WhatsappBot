export const db =   (config) => {
    const dbRoute = config.routes.PATH_DATABASE;
    return {
        chats: `${dbRoute}chats.json`,
        owners: `${dbRoute}owners.json`,
        users: `${dbRoute}users.json`,    
    }

}