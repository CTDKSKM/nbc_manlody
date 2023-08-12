import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const getLikes = async () => {
  const userId = auth.currentUser?.uid;
  try {
    const q = query(collection(db, 'likes'), where('userId', '==', userId));

    const snapshot = await getDocs(q);
    const likedTracks = snapshot.docs.map((doc: any) => doc.data());

    console.log('likesUserId', userId);
    console.log('likesTrack', likedTracks);
    return likedTracks.length ? likedTracks : [];
  } catch (error) {
    console.error('Error fetching liked tracks: ', error);
  }
};

export const toggleLike = async (item: any) => {
  const userId = auth.currentUser?.uid;
  const likesRef = collection(db, 'likes');
  const q = query(likesRef, where('userId', '==', userId), where('trackId', '==', item.id));

  const snapshot = await getDocs(q);

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
