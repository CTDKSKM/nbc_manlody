import React from 'react';
import useLikes from '../hooks/useLikes';
import { styled } from 'styled-components';

const FavoriteSongs = () => {
  const { data } = useLikes();
  console.log(data![0], 'favData!!!');
  return (
    <div>
      {data?.map((item, index) => {
        return (
          <BodyGrid key={item.track.uri}>
            <GridItem>{index + 1}</GridItem>
            <GridItem>
              <img src={item.track.albumUrl} alt="image" />

              <div>
                <h1>{item.track.name}</h1>
                <p>{item.track.artists[0].name}</p>
              </div>
            </GridItem>
            <GridItem>{item.track.name}</GridItem>
            <GridItem
              onClick={() => {
                //   toggleMutation.mutate(item.id);
              }}
            >
              {/* {item.includes(item.id) ? '❤️' : '🤍'} */}
            </GridItem>
            <GridItem
            // onClick={() => {
            //   setSelectedTrack(item);
            //   setModalOpen(true);
            // }}
            >
              Add playlist
            </GridItem>
            <GridItem>{/* {timeData[index]} */}</GridItem>
          </BodyGrid>
        );
      })}
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
