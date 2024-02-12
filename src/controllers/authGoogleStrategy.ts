import {User} from "@prisma/client";
import {findUserByGoogleId, setGoogleIdToExistingUserOrCreateNewUser} from "../repositories/userRepository";
import {generateRandomPassword} from "./userController";
import {google, oauth2_v2} from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID as string,
    process.env.GOOGLE_CLIENT_SECRET as string,
    `http://localhost:${process.env.PORT}/auth/google/callback`
)

// only for test purposes
export const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: ['profile', 'email']
})

export async function getAccessToken(code: string) {
    const tokens = await oauth2Client.getToken(code)
    return tokens.tokens.access_token
}

export async function getUserData(accessToken: string) {
    const userData = await google.oauth2('v2').userinfo.get({}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return userData.data
}

export async function verifyUser(userData: oauth2_v2.Schema$Userinfo) {
    let user: User | null = await findUserByGoogleId(userData.id as string)
    if (user) {
        return user
    }

    const data = {
        name: userData.name as string,
        password: await generateRandomPassword(),
        email: userData.email as string,
        googleId: userData.id as string
    }
    return await setGoogleIdToExistingUserOrCreateNewUser(data)
}