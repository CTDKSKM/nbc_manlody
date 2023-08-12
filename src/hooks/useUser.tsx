import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from "firebase/auth";

const useUser = () => {
  const user = auth.currentUser;
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userImg, setUserImg] = useState<string>('');

  const setUserProfile = async(name:string,imgUrl:string) => {
    await updateProfile(user!, {displayName : name??userName,  photoURL : imgUrl??userImg})
    setUserName(name??userName);
    setUserImg(imgUrl??userImg); 
  }

  useEffect(() => {
    if (user) {
      const nickName = user.displayName ?? '익명';
      const userEmail = user.email ?? '';
      const userImg = user.photoURL ?? '';
      setUserName(nickName);
      setUserId(user.uid);
      setUserEmail(userEmail);
      setUserImg(userImg);
    }
  }, [user]);

  return { userId, userName, userEmail, userImg, setUserProfile };
};

export default useUser;
