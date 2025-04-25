
import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@acumant.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  }, {
    id: "3",
    name: "John Doe",
    email: "gyan@gg.com",
    password: "123", // In a real app, this would be hashed
    role: "superadmin",
  },

]

export async function login(email: string, password: string) {
  // In a real app, this would verify credentials and create a session
  const user = users.find((u) => u.email === email && u.password === password)
}




export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}