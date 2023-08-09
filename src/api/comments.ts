import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const saveComment = async (data: ReviewCommentData) => {
  try {
    await addDoc(collection(db, "comments"), data);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getComments = async (): Promise<
  ReviewCommentData[] | undefined
> => {
  try {
    const querySnapshot = await getDocs(collection(db, "comments"));
    const comments: ReviewCommentData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data() as Omit<ReviewCommentData, "docId">;
      const data: ReviewCommentData = { ...docData, docId: doc.id };
      comments.push(data);
    });

    return comments;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const deleteComment = async (docId: string) => {
  try {
    await deleteDoc(doc(db, "comments", docId));
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const updateComment = async (data: ReviewCommentData) => {
  try {
    const docId = data.docId!;
    await setDoc(doc(db, "comments", docId), data);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
