import { getTopTracks } from "@/lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const { time_range } = req.query;
  const response = await getTopTracks(accessToken, time_range);
  const items = await response.json();

  return res.status(200).json(items);
};

export default handler;
