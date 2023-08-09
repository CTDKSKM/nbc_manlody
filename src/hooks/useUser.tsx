import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

const useUser = () => {
  const user = auth.currentUser;

  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (user) {
      const nickName = user.displayName ?? "익명";
      setUserName(nickName);
      setUserId(user.uid);
    }
  }, [user]);

  return { userId, userName };
};

export default useUser;
