import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { dbConnect } from "~/utils/dbConnect";
import { getServerAuthSession } from "./auth";
import { Session } from "next-auth";

interface CreateContextOptions {
  session: Session | null;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // for API-response caching see https://trpc.io/docs/caching
  const { req, res } = opts;

  await dbConnect();

  const session = await getServerAuthSession({ req, res });

  return {
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
