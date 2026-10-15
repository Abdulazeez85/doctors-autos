import "next-auth";
import "next-auth/jwt";

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import {
  loginEmailRateLimit,
  loginIpRateLimit,
} from "@/lib/login-rate-limit";

declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },




      
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        try {
          const requestHeaders = await headers();
          const ip = requestHeaders.get("x-real-ip")?.trim();

          if (!ip) {
            console.error("Login rate limiting unavailable: client IP missing.");
            return null;
          }

          const [ipLimit, emailLimit] = await Promise.all([
            loginIpRateLimit.limit(ip),
            loginEmailRateLimit.limit(`${email}:${ip}`),
          ]);

          if (!ipLimit.success || !emailLimit.success) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash,
          );

          if (!passwordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Login authentication or rate limiting failed:", error);
          return null;
        }
      },


    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.id) {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true },
        });

        if (!currentUser) {
          token.id = "";
          token.role = "";
        } else {
          token.role = currentUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "";
      }

      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },
});
