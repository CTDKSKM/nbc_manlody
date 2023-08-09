import React from 'react'
//@ts-ignore
import SpotifyPlayer from 'react-spotify-web-playback'

type PlayerProps = {
  accessToken: string;
  trackUri: string | undefined;
}

const Player = ( {accessToken, trackUri}: PlayerProps ) => {
  if (!accessToken) return null
  return <SpotifyPlayer
  token={accessToken}
  showSaveIcon
  uris={trackUri ? [trackUri] : []}
  initialVolume={0.5}
  />
}

export default Player