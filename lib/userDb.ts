import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data/users.json")

// Ensure DB directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
}

// Ensure DB file exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]))
}

export type DbUser = {
    id: string
    name: string
    email: string
    image?: string
    createdAt: string
    // Distinguish if they registered manually or via Google Auth
    provider: "google" | "credentials" 
}

export function getAllUsers(): DbUser[] {
    try {
        const data = fs.readFileSync(DB_PATH, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

export function getUserByEmail(email: string): DbUser | undefined {
    const users = getAllUsers()
    return users.find(u => u.email === email)
}

export function saveUser(user: DbUser) {
    const users = getAllUsers()
    users.push(user)
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2))
}

export function findOrCreateGoogleUser(profile: {
    id: string
    name: string
    email: string
    image: string
}): DbUser {
    let user = getUserByEmail(profile.email)
    
    // Auto Create user logic
    if (!user) {
        user = {
            id: profile.id, // we map google's unique user Id here
            name: profile.name,
            email: profile.email,
            image: profile.image,
            createdAt: new Date().toISOString(),
            provider: "google"
        }
        saveUser(user)
    }

    return user
}
