import React from 'react'
//@ts-ignore
import SpotifyPlayer from 'react-spotify-web-playback'
import { accessToken } from '../Header';

type PlayerProps = {
  accessToken: string;
  trackUri: string | undefined;
}

const Player = () => {

  if (!accessToken) return null
  return <SpotifyPlayer
  token={accessToken}
  showSaveIcon
  // uris={trackUri ? [trackUri] : []}
  uris={
    'spotify:track:1jsY6pQeNaEConZWGau1L4'
  }

  initialVolume={0.5}

  />
}

export default Player