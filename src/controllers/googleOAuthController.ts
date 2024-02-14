import {User} from "@prisma/client";
import {findUserByGoogleId, setGoogleIdToExistingUserOrCreateNewUser} from "../repositories/userRepository";
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
        password: undefined,
        email: userData.email,
        googleId: userData.sub
    }
    return await setGoogleIdToExistingUserOrCreateNewUser(data)
}