import { betterAuth } from "better-auth";
import { toNodeHandler } from "better-auth/node";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  adapter: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: { enabled: true },
  session: {
    jwt: false, // uses DB sessions
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});

export const handler = toNodeHandler(auth.handler);
