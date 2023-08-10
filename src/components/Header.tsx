import React, { useEffect, useRef, useState } from "react";
import Profile from "./Profile";
import { styled } from "styled-components";
import { SearchOutlined, StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./Dashboard/TrackSearchResult";

export interface Track {
  albumUrl: string | undefined;
  artist: string | undefined;
  name: string | undefined;
  title: string | undefined;
  track_uri: string | undefined;
  albumId: string | number | undefined;
  album_type: string | undefined;
  release_date: string | undefined;
  album_uri: string | undefined;
}

type AlbumImg = {
  height: number;
  width: number;
  url: string;
};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

export const accessToken = "BQCwA_r7GCCqHpKcBcAdEpuuVbPpCRl2u0CaLhRM-DGS5x_u2v-yRfLR-WI0PNoygNzvx4LQAYsY7n5AWaZnQRxg6CIskQ5UpHyRZPHxFJxa73WFV0GDXdjnskHlIEMNjM0h3MVYd16C6xRJGH5KdXlEwmBzBamxdsqEv5YKMEY7mf8ik6EguvoDhuX6YhkS6PDNM2FRKvO5YD2Qar5MxpFpCMiKkHhc"

const Header: React.FC = () => {
  // const searchIconRef = useRef<HTMLSpanElement | null>(null);
  // const searchInputRef = useRef<HTMLSpanElement | null>(null);

  // useEffect(() => {
  //     if (searchInputRef.current) {
  //         searchInputRef.current.focus(); // 컴포넌트 마운트 시 자동 포커스
  //     }
  // }, []);

  // const handleInputFocus = () => {
  //     if (searchIconRef.current) {
  //         searchIconRef.current.style.opacity = "0";
  //     }
  //     if (searchInputRef.current) {
  //         searchInputRef.current.style.transform = "translate(-30px)";
  //     }
  // };
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track | undefined>();
  
  const chooseTrack = (track: Track) => {
    setPlayingTrack(track);
    // setSearch("")
  };
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    if (!accessToken) return;

    let cancel = false;
    //spotify로부터 어떤 곡을 검색할지 요청. { limit: 5}: 5개만 가져오기
    spotifyApi.searchTracks(search, { limit: 5 }).then((res: any) => {
      console.log("res==>>", res);
      if (cancel) return;

      const tracks: Track[] = res.body.tracks.items.map((track: any) => {
        const biggestAlbumImage = track.album.images[0].url
        return {
          artist: track.artists[0].name,
          title: track.name,
          name: track.album.name,
          track_uri: track.uri,
          albumUrl: biggestAlbumImage,
          albumId: track.album.id,
          album_type: track.album.album_type,
          release_date: track.album.release_date,
          album_uri: track.album.uri
        };
      });
      setSearchResults(tracks);
    });
    return () => {
      cancel = true;
    };
  }, [search, accessToken, setSearch]);
  const handleSignOut = async () => {
    await signOut(auth);
  };

  const searchInputRef = useRef(null);
  const handleWindowClick = (e: MouseEvent) => {
    if (e.target !== searchInputRef.current) setSearch("");
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
  }, []);


  
  return (
    <HeaderTag>
      <Space style={{ gap: "4px" }}>
        <Tooltip title="next">
          <Button shape="circle" icon={<StepBackwardOutlined />} />
        </Tooltip>
        <Tooltip title="forward">
          <Button shape="circle" icon={<StepForwardOutlined />} />
        </Tooltip>
      </Space>
      <form>
        <label>
          <SearchOutlined />
        </label>
        <input
        ref={searchInputRef}
          type="search"
          placeholder="검색어를 입력해 주세요."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // 엔터 키가 눌렸을 때 검색 로직
            }
          }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          // onFocus={handleInputFocus}
          // ref={searchInputRef}
        />
        <div className="search-result">
          {searchResults.map((track) => (
            <TrackSearchResult setSearch={setSearch} track={track} key={track.track_uri} chooseTrack={chooseTrack} />
          ))}
        </div>
      </form>

      <div>
        <Profile />
      </div>
    </HeaderTag>
  );
};

export default Header;

const HeaderTag = styled.header`
  position: relative;
  width: 100%;
  // margin: 0 auto;
  // margin-right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px dotted gray;
  padding: 1.5rem 0;

  input {
    padding: 10px;
    width: 320px;
    border: none;
    border-radius: 8px;
  }
  .search-result {
    position: absolute;
    width: 88%;
    max-width: 310px;
    overflow: hidden; 
    
    border-radius: 8px;

    margin:4px 0 0;
    margin-left: 20px; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
  }
`;
