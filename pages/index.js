import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { convertTime } from "@/utils/convertTime";
import { removeImageBackground } from "@/utils/removeImageBackground";

export default function Home() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState("short_term");
  const [user, setUser] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [playlistLink, setPlaylistLink] = useState("");
  const [playlistUri, setPlaylistUri] = useState("");
  const [spotifyCode, setSpotifyCode] = useState(null);

  const date = new Date();
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeRangeMap = {
    short_term: "Last Month",
    medium_term: "Last 6 Months",
    long_term: "All Time",
  };

  const timeRanges = ["short_term", "medium_term", "long_term"];

  const createPlaylist = async () => {
    await fetch("/api/createPlaylist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        name: `Receiptify ${timeRangeMap[timeRange]} ${date.toLocaleDateString(
          "en-US"
        )}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaylistLink(data.external_urls.spotify);
        setPlaylistUri(data.uri);
        let uris = topTracks.map((track) => track.uri);
        fetch("/api/addTracksToPlaylist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlistId: data.id,
            uris: uris,
          }),
        });
      })
      .then(toast.success("Playlist created!"))
      .catch((err) => console.log(err));
  };

  const getUser = async () => {
    const res = await fetch("/api/user");
    const user = await res.json();
    setUser(user);
  };

  const getTopTracks = async () => {
    let totalTime = 0;
    const res = await fetch(`/api/topTracks?time_range=${timeRange}`, {
      next: { revalidate: 3600 },
    });
    const { items } = await res.json();

    items.forEach((item) => {
      totalTime += item.duration_ms;
      item.artists = item.artists.map((artist) => artist.name).join(", ");
    });

    setTopTracks(items);
    setTotalTime(totalTime);
  };

  useEffect(() => {
    if (session) {
      getUser();
      getTopTracks();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getTopTracks();
    }
  }, [timeRange]);

  useEffect(() => {
    const createSpotifyCode = async () => {
      const image = await removeImageBackground(
        playlistUri
          ? `https://scannables.scdn.co/uri/plain/jpeg/ffffff/black/640/${playlistUri}`
          : `https://scannables.scdn.co/uri/plain/jpeg/ffffff/black/640/${user?.uri}`
      );
      setSpotifyCode(image);
    };

    createSpotifyCode();
  }, [user, playlistLink]);

  const ref = useRef(null);
  const saveImage = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    html2canvas(ref.current, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,
    }).then((canvas) => {
      canvas.toBlob(function (blob) {
        saveAs(blob, `${timeRange}.png`);
      });
    });
  }, [ref]);

  const sharePlaylist = () => {
    navigator.clipboard.writeText(playlistLink);
    toast.success("Playlist link copied to clipboard!", {
      toastId: "sharePlaylist",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white text-2xl p-3">
      {session ? (
        <div className="flex flex-col gap-6 justify-center items-center">
          <div className="flex flex-row gap-9">
            {timeRanges.map((timeRange) => (
              <Button
                key={timeRange}
                label={timeRangeMap[timeRange]}
                action={() => {
                  setTimeRange(timeRange);
                  setPlaylistLink("");
                  setPlaylistUri("");
                }}
              />
            ))}
          </div>
          <div
            className="w-[340px] h-auto bg-[url('/receipt-paper.jpg')] text-black p-5 brightness-110 uppercase text-[22px] leading-5 gap-2"
            ref={ref}
            style={{ fontFamily: "Merchant Copy" }}
          >
            <div className="flex flex-col items-center mb-1">
              <h1 className="text-6xl">Receiptify</h1>
              <span className="text-2xl">{timeRangeMap[timeRange]}</span>
            </div>
            <div className="flex flex-col">
              <span>Date: {date.toLocaleDateString("en-US", dateOptions)}</span>
              <div className="flex w-full gap-6 border-y border-dashed border-black">
                <span>Qty</span>
                <div className="flex justify-between w-full">
                  <span>Item</span>
                  <span>Amt</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-1">
                {topTracks.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-3">
                      <div className="flex flex-row justify-between w-full gap-4">
                        <span className="w-[36px]">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="flex justify-between w-full gap-4">
                          <span>
                            {item.name} - {item.artists}
                          </span>
                          <span>{convertTime(item.duration_ms)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-y border-dashed border-black py-1 flex flex-col gap-4">
                  <div className="flex flex-row justify-between">
                    <span>Item Count:</span>
                    <span>{topTracks.length}</span>
                  </div>
                  <div className="flex flex-row justify-between font-bold">
                    <span>Total:</span>
                    <span>{convertTime(totalTime)}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span>Card #: **** **** **** {date.getFullYear()}</span>
                  <span>Auth Code: 123456</span>
                  <span>Cardholder: {user?.display_name}</span>
                </div>
                <div className="flex flex-col items-center mt-1">
                  <span className="mb-2">Thank you for visiting!</span>
                  {spotifyCode && (
                    <Image
                      src={spotifyCode}
                      width={200}
                      height={50}
                      alt="Spotify Code"
                    />
                  )}
                  <span className="lowercase">next-receiptify.vercel.app</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-2/3">
            {!playlistLink ? (
              <Button label="Create Playlist" action={createPlaylist} />
            ) : (
              <Button label="Share Playlist" action={sharePlaylist} />
            )}
            <Button label="Save Image" action={saveImage} />
          </div>
          <Button label="Sign out" action={() => signOut()} />
        </div>
      ) : (
        <div className="flex gap-9 flex-wrap justify-center">
          <div className="flex flex-col gap-3 justify-center items-center text-center">
            <h1 className="text-8xl">Receiptify</h1>
            <p>
              Convert your top Spotify tracks into a receipt and playlist to
              share!
            </p>
            <div>
              <Button
                label="Sign in with Spotify"
                action={() => signIn("spotify")}
              />
            </div>
          </div>
          <Image
            src="/example.png"
            width={300}
            height={600}
            alt="Example"
            quality={100}
            className="md:w-[200px] lg:w-[300px]"
          />
        </div>
      )}
    </div>
  );
}
