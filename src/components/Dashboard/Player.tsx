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
    <StPlayerCtn>
      <SpotifyPlayer
        hideAttribution={true}
        styles={{
          trackNameColor: 'red',
          altColor: 'blue',
          bgColor: 'pink',
          loaderColor: 'purple',
          height: 80,
          color: 'blue'
        }}
        token={accessToken}
        uris={trackUri}
        initialVolume={0.2}
      />
    </StPlayerCtn>
  );
};

export default Player;

const StPlayerCtn = styled.div`
  min-height: 80px;
  width: 800px;
  border-radius: 15px;
  overflow: hidden;
`;
