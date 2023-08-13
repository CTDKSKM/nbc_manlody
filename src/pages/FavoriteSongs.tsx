import React from 'react';
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
    <div>
      {
        //@ts-ignore
        data?.map((item, index) => {
          return (
            <BodyGrid key={item.track.uri}>
              <GridItem>{index + 1}</GridItem>
              <GridItem>
                <PiPlayFill className="play-track" onClick={() => playTrack(item)} />

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
    </div>
  );
};

export default FavoriteSongs;
const GridItem = styled.div`
  display: flex;
  align-items: center;
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
    justify-content: space-between;
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
  .play-track {
    font-size: 20px;
    cursor: pointer;
  }

  .PiPlaylistBold {
    font-size: 20px;
    cursor: pointer;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 4fr 0.7fr 0.7fr 0.7fr;
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
