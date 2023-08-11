import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const userId = auth.currentUser?.uid;

export const getLikes = async () => {
  try {
    console.log(userId, 'getLikes');
    const q = query(collection(db, 'likes'), where('userId', '==', userId));

    const snapshot = await getDocs(q);
    console.log('1');
    const likedTracks = snapshot.docs.map((doc: any) => doc.data());
    console.log(likedTracks, 'likedTracks');
    return likedTracks;
  } catch (error) {
    console.error('Error fetching liked tracks: ', error);
  }
};
