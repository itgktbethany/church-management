import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db";
import * as schema from "@/lib/db/schema"

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    database: drizzleAdapter(db, { provider: "pg", schema }),

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

    advanced: {
        defaultCookieAttributes: {
            maxAge: 60 * 60 * 24 * 10, // Ensure session_token cookie is always persistent
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

})