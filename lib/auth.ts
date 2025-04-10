// Mock authentication functions - in a real app, these would use NextAuth or similar

// Mock user data
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

// Mock session
let currentUser: (typeof users)[0] | null = users[0] // Default to admin for demo

export async function login(email: string, password: string) {
  // In a real app, this would verify credentials and create a session
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Invalid credentials")
  }

  currentUser = user
  return user
}

export async function logout() {
  // In a real app, this would destroy the session
  currentUser = null
  return true
}

export async function getCurrentUser() {
  // In a real app, this would check the session
  return currentUser
}

