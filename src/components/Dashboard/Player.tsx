import React, { useEffect, useRef, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { accessToken } from '../Header';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';

type Props = {
  rgba: number[];
};
const Player = ({ rgba }: Props) => {
  console.log('player rgba=>', rgba);
  //@ts-ignore
  const track = useSelector((state) => state.albumTrackSliceReducer);
  const trackUri = track.map((item: any) => item.uri);
  const playerRef = useRef(null);
  const [render, setRender] = useState(false);
  useEffect(() => {
    if (playerRef.current && trackUri.length > 0) {
      //@ts-ignore
      playerRef.current.play({
        uris: trackUri
      });
    }
  }, [trackUri]);

  useEffect(() => {
    setRender(!render);
  }, [rgba]);

  if (!accessToken) return null;
  return (
    <StPlayerCtn>
      <SpotifyPlayer
        hideAttribution={true}
        styles={{
          trackNameColor: 'white',
          trackArtistColor: 'white',
          sliderHandleColor: 'white',
          sliderColor: 'white',
          loaderColor: '#fff',
          activeColor: '#fff',
          color: 'white',
          bgColor: `linear-gradient(to top left,
            rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0.95), transparent)`,
          height: 80,

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
  width: 72%;
  border-radius: 15px;
  overflow: hidden;
  // position: absolute;
  bottom: 0px;
  z-index: 5;
`;
