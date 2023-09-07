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
    dispatch(addAlbum([{ name: item.name, artists: item.artists, uri: item.uri }]));
  };

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <ModalWrapper onClick={handleWrapperClick}>
      <ModalContent onClick={handleModalContentClick}>
        <div className="modal-content">
          <div className="button-ctn">
            <button style={{ color: 'white', fontSize: '18px' }} onClick={newPlaylist}>
              Play to List
            </button>
            <button onClick={onClose}>❎</button>
          </div>
          <div className="track-box">
            {tracks.map((item: any, index: number) => {
              return (
                <BodyGrid key={item.uri}>
                  <GridItem style={{ justifyContent: 'center', alignItems: 'center' }}>{index + 1}</GridItem>
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
                        }}
                      />
                    </div>
                  </GridItem>
                </BodyGrid>
              );
            })}
          </div>
        </div>
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
  z-index: 11;
`;

const ModalContent = styled.div`
  background-color: rgba(236, 236, 236, 0.61);
  padding: 20px 10px 20px;
  border-radius: 10px;
  height: 54%;
  width: 60%;
  max-width: 600px;
  z-index: 13;

  .track-box {
    height: 95%;
    padding: 0 14px 20px;
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 8px;
      &::-webkit-scrollbar-thumb {
        background-color: rgba(224, 224, 224, 0.734);
        border-radius: 5px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 5px;
      }
    }
  }
  .modal-content {
    height: 100%;
    padding: 20px;
  }

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
  padding: 0px 10px;
  font-size: 14px;

  .name-ctn {
    width: 60px;
    overflow: hidden;
  }
  button {
    color: white;
  }

  img {
    width: 40px;
    border-radius: 4px;
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
    height: 16px;
    overflow: hidden;
    letter-spacing: -0.5px;
  }
  & > div > p {
    font-size: 14px;
    font-size: 16px;
    height: 16px;
    letter-spacing: -0.5px;
    color: #bdbdbd;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .PiPlayFill {
    scale: 1.5;
    cursor: pointer;
    transition-duration: 0.3s;
    margin-right: 4rem;
    overflow: hidden;
    &:hover {
      color: #c30000;
      transition: all 0.3s ease-in-out;
      transform: scale(1.5);
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
    left: -20px;
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
  grid-template-columns: 1fr 2fr 1fr 1fr;
  padding: 10px 0px;
  color: #000;
`;

const BodyGrid = styled(Grid)`
  padding: 10px 0px;
  border-radius: 8px;
  margin: 6px 0px;
  background: rgb(255, 200, 140, 0.7);
  color: #fff;
  &:hover {
    background: rgb(255, 200, 140, 1);
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
    <PlayListTag>
      <form onSubmit={submitHandler} style={{ zIndex: 1 }}>
        <label>PlayList</label>
        <input type="text" value={playlistName} onChange={changePlaylistNameHandler} />
        <button>생성</button>
      </form>
    </PlayListTag>
  );
};
const PlayListTag = styled.div`
  width: 40%;
  height: 10%;
  margin-top: 10px;
  z-index: 2;

  form {
    margin-left: -40px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    label {
      font-weight: 600;
      color: white;
    }
  }

  input {
    border-radius: 4px;
    padding: 6px 0px;
    width: 50%;
  }
  button {
    width: 60px;
    background: rgba(255, 255, 255, 0.5);
    padding: 6px 10px;
    border-radius: 4px;
  }
`;

const PlayList = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { userId } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTracks, setCurrentTracks] = useState<{}[]>([]);

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
      <CarouselWrapper>
        <NewPlayList onAddPlaylist={handleAddPlaylist} />
        <div>
          <PlayListTag />
          <Slider {...settings}>
            {playlists?.map((item: any) => {
              return (
                <div className="box" key={item.id} onClick={() => handleShowTracks(item.tracks)}>
                  <img src={item.tracks[0]?.albumImg} alt="No Image" />
                  <h5>{item?.name}</h5>
                  <CgCloseO className="CgCloseO" onClick={(e) => handleDeletePlaylist(e, item.id)}></CgCloseO>
                </div>
              );
            })}
          </Slider>
        </div>
      </CarouselWrapper>

      {isModalOpen && <Modal onClose={handleCloseModal} tracks={currentTracks} />}
    </>
  );
};

export default PlayList;

const CarouselWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  margin: auto;
  height: 65vh;

  .slick-slide .box {
    overflow: hidden;
    cursor: pointer;
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
    margin: 18px auto 0;
    width: 70%;
    border-radius: 8px;
    object-fit: cover;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out;
  }
  .slick-prev,
  .slick-next {
    top: 50%;
  }
  .slick-list {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .slick-track {
    height: 90%;
    display: flex;
    justify-content: center;
  }
  .slick-slider {
    width: 60vw;
    height: 100%;
    margin: auto;
  }
  .CgCloseO {
    position: absolute;
    scale: 1.5;
    top: 0;
  }
`;
