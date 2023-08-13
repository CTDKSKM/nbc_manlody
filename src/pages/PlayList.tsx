import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { addDoc, collection, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';

import { db } from '../firebase';
import useUser from '../hooks/useUser';
import { useDispatch } from 'react-redux';
import { changePlaylist, addAlbum } from '../redux/modules/playUris';
import { PiPlaylistBold, PiPlayFill } from 'react-icons/pi';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { CgCloseO } from 'react-icons/cg';

interface Playlist {
  id: string;
  name: string;
  userId: string;
  tracks: {}[];
}

const Modal: React.FC<ModalProps> = ({ onClose, tracks }) => {
  const [showTooltip, setShowTooltip] = useState<Array<boolean>>(Array(tracks.length).fill(false));

  const dispatch = useDispatch();

  const newPlaylistSong = tracks.map((item: any) => ({ name: item.name, artists: item.artists, uri: item.uri }));

  const newPlaylist = () => {
    dispatch(changePlaylist(newPlaylistSong));
  };

  const playTrack = (item: any) => {
    dispatch(changePlaylist([{ name: item.name, artists: item.artists, uri: item.uri }]));
  };

  const addPlayingNow = (item: any) => {
    console.log('item', item);
    dispatch(addAlbum([{ name: item.name, artists: item.artists, uri: item.uri }]));
  };

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  console.log('showTooltip==>', showTooltip);
  return (
    <ModalWrapper onClick={handleWrapperClick}>
      <ModalContent onClick={handleModalContentClick}>
        <div className="button-ctn">
          <button onClick={newPlaylist}>Play to List</button>
          <button onClick={onClose}>❎</button>
        </div>
        {/* {tracks.map((track: any, index) => (
          <p key={track.id}>
            {track.name} - {track.artists[0].name}
          </p>
        ))} */}

        {/* ================================================================ */}
        <div className="track-box">
          {tracks.map((item: any, index: number) => {
            return (
              <BodyGrid key={item.uri}>
                <GridItem>{index + 1}</GridItem>
                <GridItem>
                  <PiPlayFill className="PiPlayFill" onClick={() => playTrack(item)} />
                  <img src={item.albumImg} alt="No Image" />
                  <div className="name-ctn">
                    <h1>{item?.name < 10 ? item.name : `${item.name.slice(0, 10)}...`}</h1>
                    <p>{item.artists[0].name}</p>
                  </div>
                </GridItem>
                <GridItem>{item.albumName}</GridItem>

                <GridItem>
                  <div className="tooltip-ctn">
                    {showTooltip[index] && <span className="tooltip">재생목록 추가</span>}
                    <PiPlaylistBold
                      className="PiPlaylistBold"
                      onMouseEnter={() => {
                        const updatedTooltip = [...showTooltip];
                        updatedTooltip[index] = true;
                        setShowTooltip(updatedTooltip);
                      }}
                      onMouseLeave={() => {
                        const updatedTooltip = [...showTooltip];
                        updatedTooltip[index] = false;
                        setShowTooltip(updatedTooltip);
                      }}
                      onClick={() => {
                        addPlayingNow(item);
                        // setModalOpen(true);
                      }}
                    />
                  </div>
                </GridItem>
                {/* <GridItem>{timeData[index]}</GridItem> */}
              </BodyGrid>
            );
          })}
        </div>

        {/* ============================================================== */}
      </ModalContent>
    </ModalWrapper>
  );
};

interface ModalProps {
  onClose: () => void;
  tracks: {}[];
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  height: 70%;
  width: 60%;
  max-width: 600px;

  .button-ctn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    > button {
      margin: 0;
    }
  }
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
    /* justify-content: space-between; */
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
    margin-right: 2rem;
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
  grid-template-columns: 1fr 0.7fr 3fr 1fr 1fr;
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
`;

// ================================================

const NewPlayList = ({ onAddPlaylist }: { onAddPlaylist: (playlist: Playlist) => void }) => {
  const [playlistName, setPlaylistName] = useState('');
  const { userId } = useUser();

  const submitHandler = async (e: any) => {
    e.preventDefault();

    if (playlistName && userId) {
      try {
        const docRef = await addDoc(collection(db, 'playlists'), {
          name: playlistName,
          userId,
          tracks: []
        });

        onAddPlaylist({ id: docRef.id, name: playlistName, userId, tracks: [] });
        setPlaylistName('');
      } catch (error) {
        console.error('Error adding playlist: ', error);
      }
    }
  };

  const changePlaylistNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(e.target.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <label>플레이리스트 이름</label>
      <input type="text" value={playlistName} onChange={changePlaylistNameHandler} />
      <button>생성</button>
    </form>
  );
};

const PlayList = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { userId } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTracks, setCurrentTracks] = useState<{}[]>([]);

  //============================================================
  const navigate = useNavigate();
  const settings = {
    slide: 'div',
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    infinite: true,
    speed: 500,
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: playlists.length > 4 ? 4 : playlists.length,
    slidesToScroll: Math.ceil(playlists.length / 2),
    draggable: true,
    cssEase: 'linear',
    gap: 10,
    responsive: [
      // 반응형 웹 구현 옵션
      {
        breakpoint: 960, //화면 사이즈 960px일 때
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768, //화면 사이즈 768px일 때
        settings: {
          //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
          slidesToShow: 2
        }
      }
    ]
  };

  //============================================================

  const handleShowTracks = (tracks: {}[]) => {
    setCurrentTracks(tracks);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTracks([]);
  };

  const handleAddPlaylist = (playlist: Playlist) => {
    setPlaylists((prevPlaylists) => [...prevPlaylists, playlist]);
  };

  const handleDeletePlaylist = async (e: React.MouseEvent<SVGElement>, id: string) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'playlists', id));
      setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.id !== id));
    } catch (error) {
      console.error('Error deleting playlist: ', error);
    }
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (userId) {
        try {
          const q = query(collection(db, 'playlists'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);

          setPlaylists(querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Playlist, 'id'>) })));
        } catch (error) {
          console.error('Error fetching playlists: ', error);
        }
      }
    };

    fetchPlaylists();
  }, [userId]);

  return (
    <>
      <NewPlayList onAddPlaylist={handleAddPlaylist} />

      <CarouselWrapper>
        <Slider {...settings}>
          {playlists?.map((item: any, index: number) => {
            return (
              <div className="box" key={item.id} onClick={() => handleShowTracks(item.tracks)}>
                {/* <img src={item.images[0].url} alt="No Image" /> */}
                <h5>{item?.name}</h5>
                <CgCloseO className="CgCloseO" onClick={(e) => handleDeletePlaylist(e, item.id)}></CgCloseO>
                {/* <p>{item.artists[0].name}</p> */}
              </div>
            );
          })}
        </Slider>
      </CarouselWrapper>

      {isModalOpen && <Modal onClose={handleCloseModal} tracks={currentTracks} />}
    </>
  );
};

export default PlayList;

// ================Carousel================
const CarouselWrapper = styled.section`
  margin-top: 1.5rem;
  height: 160px;
  .slick-slide .box {
    overflow: hidden;
  }
  .slick-slide {
    box-sizing: border-box;
    min-width: 300px;
    max-width: 80%;
    margin: 0 15px;
    background-color: rgba(236, 236, 236, 0.61);
    border-radius: 8px;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  .slick-slide:hover {
    transform: scale(1.02);
    filter: brightness(1.2);
  }

  .container {
    width: 90%;
  }
  h5 {
    margin-top: 10px;
    font-weight: 600;
  }
  h5,
  p {
    text-align: center;
  }
  p {
  }
  img {
    /* margin: 0 auto; */
    margin-top: 18px;
    width: 80px;
    border-radius: 50%;
    object-fit: cover;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  .slick-prev {
    top: 90%;
  }
  .slick-next {
    top: 90%;
  }
  .slick-list {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .slick-track {
    height: 90%;
    display: flex;
    justify-content: center;
  }
  .slick-slider {
    width: 60vw;
    height: 100%;
    /* margin: 0 auto; */
  }
  .CgCloseO {
    position: absolute;
    scale: 1.5;
    top: 0;
  }
`;

// ================================
