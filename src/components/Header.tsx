import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

import { Button, Tooltip, Space } from 'antd';
import { SearchOutlined, StepForwardOutlined, StepBackwardOutlined } from '@ant-design/icons';
import SpotifyWebApi from 'spotify-web-api-node';

import TrackSearchResult from './Dashboard/TrackSearchResult';
import Profile from './Profile';

export interface Track {
  albumUrl?: string;
  artist?: string;
  name?: string;
  title?: string;
  track_uri?: string;
  albumId?: string | number;
  album_type?: string;
  release_date?: string;
  album_uri?: string;
}

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID
});

export const accessToken = sessionStorage.getItem('access_token');

const Header: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>();

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
    spotifyApi.searchTracks(search, { limit: 5 }).then((res) => {
      if (cancel) return;

      const tracks = res.body.tracks?.items.map((track) => {
        const biggestAlbumImage = track.album.images[0].url;
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
  }, [search, accessToken]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleWindowClick = (e: MouseEvent) => {
    if (e.target !== searchInputRef.current) setSearch('');
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
  }, []);

  return (
    <HeaderTag>
      <HoverableSpace>
        <Tooltip title="next">
          <Button shape="circle" icon={<StepBackwardOutlined />} />
        </Tooltip>
        <Tooltip title="forward">
          <Button shape="circle" icon={<StepForwardOutlined />} />
        </Tooltip>
      </HoverableSpace>
      <form>
        <InputContainer>
          <SearchInput
            ref={searchInputRef}
            type="search"
            placeholder="검색어를 입력해 주세요."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
              }
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-result">
            {searchResults?.map((track) => (
              <TrackSearchResult setSearch={setSearch} track={track} key={track.track_uri} />
            ))}
          </div>
          <SearchIcon src="https://i.ibb.co/ZNzFRNv/icons8-search-50.png" alt="search icon" />
        </InputContainer>
      </form>
      <div>
        <Profile />
      </div>
    </HeaderTag>
  );
};

export default Header;

const HoverableSpace = styled(Space)`
  gap: 4px;
  opacity: 0.5;
  transition: opacity 0.3s;
  buttion {
    &:hover {
      opacity: 1;
    }
  }
`;

const HeaderTag = styled.header`
  z-index: 9;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  // border: 1px dotted gray;

  input {
    padding: 10px;
    padding-left: 34px;
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

    margin: 4px 0 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`;

const InputContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  padding-left: 20px;
`;

const SearchIcon = styled.img`
  position: absolute;
  width: 20px;
  top: 50%;
  left: 10px; /* Adjust the left position as needed */
  transform: translate(0, -50%);
  opacity: 0.7;
`;
