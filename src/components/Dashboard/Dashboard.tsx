import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Player from './Player';
import { Button, Card, Col, Container, FormControl, InputGroup, Row, Form } from "react-bootstrap";
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

export interface Track {
  albumUrl: string | undefined;
  artist: string | undefined;
  name: string | undefined;
  title: string | undefined;
  uri: string | undefined;
  albumId: string | number | undefined;
}

type AlbumImg = {
  height: number;
  width: number;
  url: string;
}

type DashboardAccessTokenProps = {
  access_token: string;
}

const Dashboard = ( {access_token}: DashboardAccessTokenProps ) => {
  const accessToken = access_token
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track | undefined>();
  const chooseTrack = (track: Track) => {
    setPlayingTrack(track);
    // setSearch("")
  }
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) {
      setSearchResults([])
      return }

    if (!accessToken) return;

    let cancel = false;
    //spotify로부터 어떤 곡을 검색할지 요청. { limit: 5}: 5개만 가져오기
    spotifyApi.searchTracks(search, { limit: 5}).then((res: any) => {
      if(cancel) return;

      const tracks: Track[] = res.body.tracks.items.map((track: any) => {
        const smallestAlbumImage = track.album.images.reduce((smallest: AlbumImg, image: AlbumImg) => {
          if (image.height < smallest.height) return image;
          return smallest;
        }, track.album.images[0]);
        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        };
      })
    setSearchResults(tracks);
    });
    return () => {cancel = true};
  }, [search, accessToken, setSearch]);
  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control type="search" placeholder="Search Songs/Artists" value={search} onChange={(event) => setSearch(event.target.value)} />
    </Container>
  );
}

export default Dashboard