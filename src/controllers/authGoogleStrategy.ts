import {User} from "@prisma/client";
import {findUserByGoogleId, setGoogleIdToExistingUserOrCreateNewUser} from "../repositories/userRepository";
import {generateRandomPassword} from "./userController";
import {google} from "googleapis";
import axios from "axios";

type UserInfo = {
    sub: string,
    name: string,
    given_name: string,
    picture: string,
    email: string,
    email_verified: boolean,
    locale: string
}

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
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return userInfo.data as UserInfo
}

export async function verifyUser(userData: UserInfo) {
    let user: User | null = await findUserByGoogleId(userData.sub)
    if (user) {
        return user
    }

    const data = {
        name: userData.name,
        password: await generateRandomPassword(),
        email: userData.email,
        googleId: userData.sub
    }
    return await setGoogleIdToExistingUserOrCreateNewUser(data)
}