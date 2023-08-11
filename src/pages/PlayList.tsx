import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { addDoc, collection, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';

import { db } from '../firebase';
import useUser from '../hooks/useUser';

interface Playlist {
  id: string;
  name: string;
  userId: string;
  tracks: {}[];
}

const Modal: React.FC<ModalProps> = ({ onClose, tracks }) => {
  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <ModalWrapper onClick={handleWrapperClick}>
      <ModalContent onClick={handleModalContentClick}>
        <button onClick={onClose}>닫기</button>
        {tracks.map((track: any, index) => (
          <p key={index}>
            {track.name} - {track.artists[0].name}
          </p>
        ))}
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
  width: 60%;
  max-width: 500px;
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

  const changePlaylistNameHandler = (e: any) => {
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

  const handleDeletePlaylist = async (id: string) => {
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
      {playlists.map((item) => (
        <List key={item.id}>
          <div onClick={() => handleShowTracks(item.tracks)}>{item.name}</div>
          <button onClick={() => handleDeletePlaylist(item.id)}>삭제</button>
        </List>
      ))}
      {isModalOpen && <Modal onClose={handleCloseModal} tracks={currentTracks} />}
    </>
  );
};

export default PlayList;

const List = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  width: 150px;
  height: 100px;
`;
