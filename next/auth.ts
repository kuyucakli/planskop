import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Keycloak from "next-auth/providers/keycloak"

import { Schema, z } from 'zod';
import { getUserByEmail } from './db/queries';
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { accountTbl, sessionTbl, userTbl, verificationTokenTbl } from './db/schema';



export const { auth, signIn, signOut, handlers } = NextAuth({

    debug: process.env.NODE_ENV !== "production",

    adapter: DrizzleAdapter(db, {
        usersTable: userTbl,
        accountsTable: accountTbl,
        sessionsTable: sessionTbl,
        verificationTokensTable: verificationTokenTbl,
    }),

    providers: [
        Keycloak({
            clientId: process.env.AUTH_KEYCLOAK_ID,
            clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
            issuer: process.env.AUTH_KEYCLOAK_ISSUER,
            allowDangerousEmailAccountLinking: true,
        }),

    ],
    session: {
        strategy: "jwt",
    },

    callbacks: {
        /*  async session({ session, token, user }) {
             // we'll update the session object with those 
             // informations besides the ones it already has
             return session
         }, */
        async authorized({ auth }) {

            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),

    },

    // pages: {
    //     signIn: "/login",
    // },


});


