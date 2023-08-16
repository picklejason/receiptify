const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getUsersPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getUser = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getTopTracks = async (refresh_token, time_range) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
};

export const createPlaylist = async (refresh_token, user_id, name) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      description: "Created with Receiptify!",
      public: false,
    }),
  });
};

export const addTracksToPlaylist = async (refresh_token, playlistId, uris) => {
  const { access_token } = await getAccessToken(refresh_token);

  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: uris,
      position: 0,
    }),
  });
};
