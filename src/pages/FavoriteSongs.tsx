import React, { useState } from 'react';
import useLikes from '../hooks/useLikes';
import { styled } from 'styled-components';
import { useDispatch } from 'react-redux';
import { changePlaylist, addAlbum } from '../redux/modules/playUris';
import { PiPlaylistBold, PiPlayFill } from 'react-icons/pi';

const FavoriteSongs = () => {
  const { data, deleteMutation } = useLikes();
  const dispatch = useDispatch();
  data?.sort((a, b) => a.likedAt - b.likedAt);
 
  const playTrack = (item: any) => {
    dispatch(changePlaylist([{ name: item.track.name, artists: item.track.artists, uri: item.track.uri }]));
  };

  const addPlayingNow = (item: any) => {
    dispatch(addAlbum([{ name: item.track.name, artists: item.track.artists, uri: item.track.uri }]));
  };
  return (
    <FavoriteWrapper>
      {
        //@ts-ignore
        data?.map((item, index) => {
          return (
            <BodyGrid key={item.track.uri}>
              <GridItem style={{textAlign : "center"}}>{index + 1}</GridItem>
              <GridItem>
                <PiPlayFill className="PiPlayFill" onClick={() => playTrack(item)} />

                <img src={item.trackImg} alt="" />

                <div>
                  <h1>{item.track.name}</h1>
                  <p>{item.track.artists[0].name}</p>
                </div>
              </GridItem>
              <GridItem>{item.track.name}</GridItem>
              <GridItem
                onClick={() => {
                  deleteMutation.mutate(item.trackId);
                }}
              >
                ❤️
              </GridItem>
              <GridItem
              // onClick={() => {
              //   setSelectedTrack(item);
              //   setModalOpen(true);
              // }}
              >
                <PiPlaylistBold
                className="PiPlaylistBold"
                  onClick={() => {
                    addPlayingNow(item);
                    // setModalOpen(true);
                  }}
                />
              </GridItem>
              <GridItem>{/* {timeData[index]} */}</GridItem>
            </BodyGrid>
          );
        })
      }
    </FavoriteWrapper>
  );
};

export default FavoriteSongs;

const FavoriteWrapper = styled.div`
width: 100%;
height: 100%;
  z-index: 7;
`;
const GridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  font-size: 14px;
  &:nth-child(5),
  :nth-child(6) {
    justify-content: center;
  }

  img {
    width: 40px;
    margin-right: 10px;
  }
  & > div {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  & > div > h1 {
    font-size: 16px;
    letter-spacing: -0.5px;
  }
  & > div > p {
    font-size: 14px;
    letter-spacing: -0.5px;
    color: #bdbdbd;
  }
  .name-ctn {
    display: flex;
    justify-content: center;
  }
  .PiPlayFill {
    scale: 1.3;
    cursor: pointer;
    transition-duration: 0.3s;
    margin-right: 4rem;
    &:hover {
      color: #c30000;
      transition: all 0.3s ease-in-out;
      transform: scale(1.4);
      rotate: 360deg;
    }
  }
  .PiPlaylistBold {
    scale: 1.2;
    cursor: pointer;
    transition-duration: 0.3s;
    &:hover {
      transition: all 0.3s ease-in-out;
      rotate: 20deg;
    }
  }
  .tooltip-ctn {
    position: relative;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tooltip {
    position: absolute;
    white-space: nowrap;
    min-width: 20px;
    top: -15px;
    left: 10px;
    background-color: #fff;
    color: #333;
    padding: 5px;
    border-radius: 5px;
    z-index: 1;
    display: block;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 4fr 1fr 1fr;
  padding: 10px 0px;
  color: #000;
`;

const BodyGrid = styled(Grid)`
  padding: 10px 0px;
  /* border-radius: 10px; */
  margin: 6px 0px;
  background: #353535;
  color: #fff;
  &:hover {
    background: #3f3f3f;
  }
  ${GridItem}:nth-child(4) {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;

    svg {
      width: 24px;
      height: 24px;
      margin-right: 5px;
    }
  }
  // 4th-child{
  //   loloClose: 20px;
  // }
`;
