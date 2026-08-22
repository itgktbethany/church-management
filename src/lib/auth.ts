import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";

import { db } from "./db";
import * as schema from "@/lib/db/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {provider: "pg", schema}),

    emailAndPassword: {
        enabled: true,
    },
    
    session: {
        expiresIn: 60 * 60 * 24 * 10, // 10 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 10, // Force persistent cookie for PWAs
        }
    },

    socialProviders:{
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    advanced: {
        defaultCookieAttributes: {
            maxAge: 60 * 60 * 24 * 10, // Force persistence on all cookies, including session_token
        },
    }
})