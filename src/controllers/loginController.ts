import db from "../models";

/**
 * The login process:
 * User login with either access code or username and password, once authenticated,
 * the user's id and a hash token is returned to the client, client hold on to that information,
 * and use the token to authenticate 
 */


//timeout: 10mins, when a user's last activity is 10mins ago, the user is considered logged out.
const TIMEOUT = 600000;

/**
 * Key is the user Id, value is an array of active hash with a timestamp,
 * Every time an user login with credentials, a hash is generated and sent to the client.
 * Client can use the hash to authorize actions as long as it hasn't timed out.
 */
const onlineUsers: {
    [key: number]: {hash: string, timestamp: number}[]
} = {};

/**
 * check if the user token is valid, 
 * for a token to be valid, it must have the correct hash and userId combination and not timed out.
 * @param renew default true, when true, token's timestamp is renewed once validated.
 */
export function confirmToken(userId: number, hash: string, renew:boolean = true): boolean {
    let match = false;
    if(onlineUsers[userId]) {
        //remove all timed out usertoken
        onlineUsers[userId] = onlineUsers[userId].filter(token => token.timestamp + TIMEOUT > Date.now());
        for(const userToken of onlineUsers[userId]) {
            if(userToken.hash === hash) {
                //found the correct hash, update timestamp
                match = true;
                if(renew) {
                    userToken.timestamp = Date.now();
                }
            }
        }
    }
    return match;
}

/**
 * create and register an userToken for the given user, should only be used after the user is authenticated.
 * @returns the hash for that token
 */
function createToken(userId: number): string {
    const token = {hash: (userId + new Date().toString()).sha256(), timestamp: Date.now()};
    //create an array if none exist
    if(!onlineUsers[userId]) {
        onlineUsers[userId] = [];
    }
    //register the token
    onlineUsers[userId].push(token);

    //return the hash
    return token.hash;
}

const loginController = {
    loginWithAccessCode: async function(req, res) {
        const accessCode = req.body.accessCode;
        try {
            //find all user with the given accesscode
            const users = await db.User.findAll({
                where: {
                    accessCode
                }
            });

            //check if only 1 user is returned, in case unqiue check failed in the db
            if(users.length === 1) {
                const user = users[0];
                //create a new hash token
                const hash = createToken(user.id);

                //respond with necessary information
                return res.status(200).json({
                    fullName: user.fullName,
                    userId: user.id,
                    hash
                });
            } else {
                //either a user is not found, or more than 1 is found (which should never happen)
                return res.status(404).send("Access Denied!");
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    loginWithPassword: async function(req, res) {
        const username = req.body.username;
        const password:string = req.body.password;

        try {
            //find all user with the given username and password
            //passwords are stored in sha256 hash
            const users = await db.User.findAll({
                where: {
                    username,
                    password: password.sha256()
                }
            });

            //check if only 1 user is returned, in case unqiue check failed in the db
            if(users.length === 1) {
                const user = users[0];
                //create a new hash token
                const hash = createToken(user.id);

                //respond with necessary information
                return res.status(200).json({
                    fullName: user.fullName,
                    id: user.id,
                    hash
                });
            } else {
                //either a user is not found, or more than 1 is found (which should never happen)
                return res.status(404).send("Access Denied!");
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}

export default loginController;