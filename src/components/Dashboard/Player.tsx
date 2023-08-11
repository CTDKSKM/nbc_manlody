import React from 'react';
//@ts-ignore
import SpotifyPlayer from 'react-spotify-web-playback';
import { accessToken } from '../Header';
import { useSelector } from 'react-redux';

type PlayerProps = {
  accessToken: string;
  trackUri: string | undefined;
};

const Player = () => {
  //@ts-ignore
  const trackUri = useSelector((state) => state.albumTrackSliceReducer);
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      // hideCoverArt={true}
      styles={{
        bgColor: 'rgba(255, 100, 0, 0.5)',
        color: 'gray'
      }}
      token={accessToken}
      showSaveIcon
      uris={trackUri}
      initialVolume={0.2}
    />
  );
};

export default Player;
