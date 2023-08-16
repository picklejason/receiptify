import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scope =
  "user-read-private user-read-email playlist-modify-public playlist-modify-private";

export const authOptions = {
  providers: [
    SpotifyProvider({
      authorization: "https://accounts.spotify.com/authorize",
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: { scope },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    async session(session, user) {
      session.user = user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
