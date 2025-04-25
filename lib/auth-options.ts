
import AzureADProvider from "next-auth/providers/azure-ad"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      tenantId: process.env.AZURE_TENANT_ID!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", 
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        const email = session.user.email

        // Role mapping
        if (email === "gyan.prakash@acumant.com") {
          session.user.role = "superAdmin"
        } else if (email === "gyan.prakash@acumant.com") {
          session.user.role = "admin"
        } else {
          session.user.role = "user"
        }
      }

      return session
    },
  },
}
