import { addTracksToPlaylist } from "@/lib/spotify";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getServerSession(req, res, authOptions);
  const { playlistId, uris } = req.body;
  const response = await addTracksToPlaylist(accessToken, playlistId, uris);
  const playlist = await response.json();
  return res.status(200).json(playlist);
};

export default handler;
