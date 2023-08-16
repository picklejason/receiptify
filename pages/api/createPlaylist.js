import { createPlaylist } from "@/lib/spotify";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getServerSession(req, res, authOptions);
  const { user_id, name } = req.body;
  const response = await createPlaylist(accessToken, user_id, name);
  const playlist = await response.json();
  return res.status(200).json(playlist);
};

export default handler;
