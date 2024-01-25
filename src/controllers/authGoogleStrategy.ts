import {OAuth2Strategy as GoogleStrategy, Profile, VerifyFunction} from "passport-google-oauth";
import {User} from "@prisma/client";
import {findUserByGoogleId, setGoogleIdToExistingUserOrCreateNewUser} from "../repositories/userRepository";
import {generateRandomPassword} from "./userController";

export const oauthGoogleStrategy: GoogleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/auth/google/callback'
}, verify)

async function verify(accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction) {
    let user: User | null = await findUserByGoogleId(profile.id)
    if (user) {
        return done(null, user)
    }
    const email = profile.emails?.at(0)?.value as string
    const data = {
        name: profile.displayName,
        password: await generateRandomPassword(),
        email: email,
        googleId: profile.id
    }
    user = await setGoogleIdToExistingUserOrCreateNewUser(data)
    return done(null, user)
}