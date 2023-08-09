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
  title: string | undefined;
  uri: string | undefined;
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
      console.log("res==>>",res)
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
      <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}/></div>
      <Form.Control type="search" placeholder="Search Songs/Artists" value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}/>
        ))}
      </div>
      
    </Container>
  );
}

export default Dashboard

//   console.log(spotifyApi)
//   const [searchInput, setSearchInput] = useState<string>("");
//   // const [accessToken, setAccessToken] = useState("");
//   const [albums, setAlbum] = useState<any[]>([]);
//   const accessToken = access_token

//   const search = async () => {
//     const searchParameters = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + accessToken,
//       },
//     };
//     let artistResponse = await axios.get("https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist", searchParameters);
//     const artistId = artistResponse.data.artists.items[0].id;

//     let albumsResponse = await axios.get("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks" + "?&market=US&limit=1", searchParameters);
//     const track = albumsResponse.data.tracks.slice(0, 2)
//     console.log(track)
//     setAlbum(track);
//   };

//   return (
//     <div className="App">
//       <Container>
//         <InputGroup className="mb-3" size="lg">
//           <FormControl
//             placeholder="Search For Artist"
//             type="input"
//             onKeyPress={(event) => {
//               if (event.key == "Enter") {
//                 search()
//               }
//             }}
//             value={searchInput}
//             onChange={(event) => setSearchInput(event.target.value)}
//           />
//           <Button onClick={search}>Search</Button>
//         </InputGroup>
//       </Container>
//       <Container>
//         <Row className="mx-2">
//           {albums.map((album, index) => 
//              (
//               <Col key={index} xs={12} sm={6} md={4} lg={3}>
//               <Card>
//               {/* <Player accessToken={accessToken} trackUri={album?.uri}/> */}
//                 {/* <Card.Img src={album.images[0].url} /> */}
//                 <Card.Body>
//                   <Card.Title>{album.name}</Card.Title>
//                 </Card.Body>
//               </Card>
//               </Col>
//             ))}
//         </Row>
//       </Container>
//     </div>
//   );