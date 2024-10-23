import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import { authConfig } from './auth.config';
import { z } from 'zod';

async function getUser(email: string, password:string): Promise<any | undefined> {
    if(email === "admin@gmail.com" && password === "072bex05"){
        return({
            username: "admin@gmail.com",
            password: "072bex05",
        });
    }
    return null;
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email, password);
          if (user) return user;
        }
 
        return null;
      },
    }),
  ],
});