import { Adapter } from "next-auth/adapters";
import { prisma } from "../prisma";

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {
      return;
    },

    async getUser(id) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatarUrl: user.avatarUrl!,
      };
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatarUrl: user.avatarUrl!,
      };
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { user } = await prisma.account.findUniqueOrThrow({
        where: {
          provider,
          providerAccountId,
        },

        include: {
          user: true,
        },
      });
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatarUrl: user.avatarUrl!,
      };
    },
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      })
      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatarUrl: prismaUser.avatarUrl!,
      };
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refreshToken,
          accessToken: account.accessToken,
          expiresAt: account.expiresAt,
          tokenType: account.tokenType,
          scope: account.scope,
          idToken: account.idToken,
          sessionState: account.sessionState,

        }
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          userId:  userId,
          expires,
          sessionToken: sessionToken,

        },
      })

      return {
        userId,
        sessionToken,
        expires
      }
    },
    async getSessionAndUser(sessionToken) {
      const {user, ...session} = await prisma.session.findUniqueOnThrow({
        where: {
          sessionToken: sessionToken,
        },
        includes: {
          user: true
        }
      })

      return {
        session: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email!,
            emailVerified: null,
            avatarUrl: user.avatarUrl!,
        }
      }
    },
    async updateSession({ sessionToken, userId, expires }) {
      const prismaSessision = await prisma.session.update({
        where: {
          sessionToken: sessionToken
        },
        data: {
          expires,
          userId: userId
        }
      })
      return {
        sessionToken: prismaSessision.sessionToken,
        userId: prismaSessision.userId,
        expires: prismaSessision.expires
      };
    },

  };
}
