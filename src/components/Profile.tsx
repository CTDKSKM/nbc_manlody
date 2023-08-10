import React, { useState } from "react";
import { styled } from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AiFillSetting } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { useQuery, useQueryClient } from "react-query";

const Profile = () => {
  const [isToggle, setIsToggle] = useState<boolean>(false);

  const { data: userInfo } = useQuery<{
    userName: string;
    userEmail: string;
    userProfilePicture: string;
  }>("userInfo");

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const userToggleButton = () => {
    setIsToggle((modal) => !modal);
  };

  return (
    <UserWrap>
      <UserInfo onClick={userToggleButton}>
        <div>
          <h1>{userInfo?.userName}</h1>
        </div>
        <img src={userInfo?.userProfilePicture} />
      </UserInfo>
      {isToggle && (
        <UserDetailWrap>
          <div>
            <h1>
              Name<span>{userInfo?.userName}</span>
            </h1>
            <h1>
              Email<span>{userInfo?.userEmail}</span>
            </h1>
          </div>
          <div>
            <UserSettingWrap>
              <button>
                <AiFillSetting />
              </button>
              <button onClick={handleSignOut}>
                <TbLogout2 />
                LogOut
              </button>
            </UserSettingWrap>
          </div>
        </UserDetailWrap>
      )}
    </UserWrap>
  );
};
export default Profile;
const UserWrap = styled.div`
  position: relative;
  left: 0;
  top: 0;
`;
const UserInfo = styled.h1`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  > img {
    width: 48px;
    height: 48px;
    border-radius: 50px;
  }
`;
const UserSettingWrap = styled.div`
  display: flex;
  justify-content: space-between;
  > button {
    margin: 0;
  }
`;
const UserDetailWrap = styled.div`
  position: absolute;
  right: 0;
  top: 72px;
  padding: 18px 22px;
  background: #6e6e6e;
  border-radius: 6px;
  > div > h1 {
    margin-bottom: 6px;
  }
  > div > h1:last-child {
    margin-bottom: 26px;
  }
  > div > h1 > span {
    margin-left: 15px;
  }
  &::before {
    display: block;
    content: "";
    position: absolute;
    right: 18px;
    top: -6px;
    width: 14px;
    height: 14px;
    background-color: #6e6e6e;
    transform: rotate(45deg);
  }
`;
