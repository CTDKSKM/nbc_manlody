import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const getLikes = async () => {
  const userId = auth.currentUser?.uid;
  try {
    const q = query(collection(db, 'likes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const likedTracks = snapshot.docs.map((doc: any) => doc.data());
    return likedTracks.length ? likedTracks : [];
  } catch (error) {
    console.error('Error fetching liked tracks: ', error);
  }
};

export const toggleLike = async (item: any) => {
  const userId = auth.currentUser?.uid;
  // db의 likes컬렉션의 정보를 likesRef에 할당
  const likesRef = collection(db, 'likes');
  // where는 field를 필터하는 메서드.(필드의 유저아이디와 trackId가 현재 필터링한 정보와 일치한 애만 가져와라)
  const q = query(likesRef, where('userId', '==', userId), where('trackId', '==', item.id));

  const snapshot = await getDocs(q);
  // 좋아요 데이터가 없을 때. firebase 메서드 empty
  if (snapshot.empty) {
    await addDoc(likesRef, {
      userId: userId,
      trackId: item.id,
      track: item,
      trackImg: item.trackImg,
      likedAt: new Date().getTime()
    });
  } else {
    for (const docSnapshot of snapshot.docs) {
      const docRef = doc(db, 'likes', docSnapshot.id);
      await deleteDoc(docRef);
    }
  }
};

//FavoriteSongs 페이지에서 하트 누르면 목록에서 제거하는 함수
export const deleteLike = async (trackId: string) => {
  const userId = auth.currentUser?.uid;
  const likesRef = collection(db, 'likes');
  const q = query(likesRef, where('userId', '==', userId), where('trackId', '==', trackId));

  const snapshot = await getDocs(q);
  for (const docSnapshot of snapshot.docs) {
    const docRef = doc(db, 'likes', docSnapshot.id);
    await deleteDoc(docRef);
  }
};
