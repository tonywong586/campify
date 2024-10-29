import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "~/server/models";
import { dbConnect } from "~/utils/dbConnect";
import argon2 from "argon2";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...user,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...token,
          email: token.email ?? "",
        };
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        await dbConnect();

        console.log("credentials", JSON.stringify(credentials));

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await UserModel.findOne({
          $or: [
            { username: credentials.username },
            { email: credentials.username },
          ],
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await argon2.verify(
          user.password,
          credentials.password
        );

        if (!isPasswordValid) {
          return null;
        }

        console.log("user", JSON.stringify(user));

        return {
          id: user._id.toString(),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          admin: user.admin ?? false,
        };
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
