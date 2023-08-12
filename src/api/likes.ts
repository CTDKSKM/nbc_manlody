import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const getLikes = async () => {
  const userId = auth.currentUser?.uid;
  try {
    const q = query(collection(db, 'likes'), where('userId', '==', userId));

    const snapshot = await getDocs(q);
    const likedTracks = snapshot.docs.map((doc: any) => doc.data());
    return likedTracks;
  } catch (error) {
    console.error('Error fetching liked tracks: ', error);
  }
};
