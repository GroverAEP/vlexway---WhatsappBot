// Recibe lista/set/array proveniente del db
export function isBanned({ msg, client }) {
    // let userBaned = false;

    const userId = msg.key.participant || msg.key.remoteJid;

    // si la db tiene un Set
    const  userBaned = client.manager.users.equals(userId,"role","banned"); 

    console.log(userId)
    console.log(userBaned)

    // if (client.manager.banned) {
    //     return client.db.local.banned.has(userId);
    // }

    // si es array
    return userBaned;
}
