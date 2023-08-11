import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const useUser = () => {
  const user = auth.currentUser;
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userImg, setUserImg] = useState<string>('');

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

  return { userId, userName, userEmail, userImg };
};

export default useUser;
