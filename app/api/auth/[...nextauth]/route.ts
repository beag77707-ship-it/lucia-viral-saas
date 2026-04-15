import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan,
          heygenAvatarId: user.heygenAvatarId,
          heygenStatus: user.heygenStatus,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        token.name = (user as any).name;
        token.image = (user as any).image;
        token.heygenAvatarId = (user as any).heygenAvatarId;
        token.heygenStatus = (user as any).heygenStatus;
      }
      // Permitir actualizar la sesión cuando el usuario edita su perfil
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.image = session.image || token.image;
        token.plan = session.plan || token.plan;
        token.heygenStatus = session.heygenStatus || token.heygenStatus;
        token.heygenAvatarId = session.heygenAvatarId || token.heygenAvatarId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
        (session.user as any).name = token.name;
        (session.user as any).image = token.image;
        (session.user as any).heygenAvatarId = token.heygenAvatarId;
        (session.user as any).heygenStatus = token.heygenStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
