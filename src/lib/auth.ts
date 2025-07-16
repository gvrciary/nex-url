import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
 
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true, 
    }, 
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID! as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID! as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
        },
    },
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    plugins: [nextCookies()]
});