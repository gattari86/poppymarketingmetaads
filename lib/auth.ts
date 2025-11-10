import { type NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.META_APP_ID || "",
      clientSecret: process.env.META_APP_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "ads_management,business_management,pages_show_list,pages_read_engagement",
        },
      },
    }),
    // Dev provider for testing - only enabled when NEXT_PUBLIC_DEV_MODE is set
    ...(process.env.NEXT_PUBLIC_DEV_MODE
      ? [
          CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "dev@example.com" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              // Dev mode: accept any credentials
              if (credentials?.email && credentials?.password) {
                return {
                  id: "dev-user",
                  email: credentials.email,
                  name: "Dev User",
                  image: null,
                };
              }
              return null;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secure-key-change-me-in-production",
  debug: process.env.NODE_ENV === "development",
};
