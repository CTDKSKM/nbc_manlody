import { signOut } from "firebase/auth";
import React from "react";
import { styled } from "styled-components";
import { auth } from "../firebase";

const Header = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };
  return (
    <StHeader>
      <button onClick={handleSignOut}>로그아웃</button>
    </StHeader>
  );
};

export default Header;

const StHeader = styled.div`
  width: 100%;
  height: 100px;
`;
