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
  title: string | undefined;
  uri: string | undefined;
  albumId: string | number | undefined;
}

type AlbumImg = {
  height: number;
  width: number;
  url: string;
};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

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
  const accessToken = "BQCAxdVYXf1AKZhIL93HuD1BxuNae0V0yI_FiWYlfjSrYpr9SzIyd3sJL8fdIcVig1PJEQN-Q3Xek11VH032zQWpyZ6jh3-Mvkypq4NyEyeoRJh4_trP5a4udfIJpwxZSzW3tW1MbewGDalt0R9G-HbiBSSzaF-qJbvMLDrJPiww-8J21ZhaXTiPstlsZ41mmTwnhTzRcUk-4GtFXntd_iZCXkoFVb-R";

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
          uri: track.uri,
          albumUrl: biggestAlbumImage,
          albumId: track.album.id,
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
        {/* <input
                    type="text"
                    placeholder="검색어를 입력해 주세요."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // 엔터 키가 눌렸을 때 검색 로직
                        }
                    }}
                    // onFocus={handleInputFocus}
                    // ref={searchInputRef}
                /> */}
        <input
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
            <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
          ))}
        </div>
      </form>

      <div>
        <button onClick={handleSignOut}>로그아웃</button>
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
