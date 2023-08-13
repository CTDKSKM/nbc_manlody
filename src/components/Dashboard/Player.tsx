import React, { useEffect, useRef } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { accessToken } from '../Header';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';

const Player = () => {
  //@ts-ignore
  const track = useSelector((state) => state.albumTrackSliceReducer);
  const trackUri = track.map((item: any) => item.uri);
  const playerRef = useRef(null);
  useEffect(() => {
    if (playerRef.current && trackUri.length > 0) {
      //@ts-ignore
      playerRef.current.play({
        uris: trackUri
      });
    }
  }, [trackUri]);

  if (!accessToken) return null;
  return (
    <StPlayerCtn>
      <SpotifyPlayer
        hideAttribution={true}
        styles={{
          trackNameColor: 'black',
          altColor: 'black',
          bgColor: 'white',
          loaderColor: 'orange',
          height: 80,
          color: 'black'
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
  z-index: 8;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  min-height: 80px;
  width: 90%;
  border-radius: 8px;
  overflow: hidden;
  // position: absolute;
  bottom: 0px;
`;
