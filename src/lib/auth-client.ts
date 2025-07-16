import { createAuthClient } from "better-auth/react"

const baseURL = process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL : "http://localhost:3000"

export const authClient = createAuthClient({
    baseURL: baseURL
})