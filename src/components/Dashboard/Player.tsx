import React, { useEffect, useRef } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { accessToken } from '../Header';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';


const Player = () => {
  //@ts-ignore
  const track = useSelector((state) => state.albumTrackSliceReducer);
  const trackUri = track.map((item: any) => item.uri)
  const playerRef = useRef(null);
  useEffect(() => {
    if (playerRef.current && trackUri.length > 0) {
      //@ts-ignore
      playerRef.current.play({
        uris: trackUri,
      });
    }
  }, [trackUri]);

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
  margin-top: 300px;
`;
