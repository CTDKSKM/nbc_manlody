import React, { useState } from 'react';
import { styled } from 'styled-components';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AiFillSetting } from 'react-icons/ai';
import { TbLogout2 } from 'react-icons/tb';
import { useQuery, useQueryClient } from 'react-query';
import useUser from '../hooks/useUser';
import axios from 'axios';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserImg, setNewUserImg] = useState<string>('');
  const [isToggle, setIsToggle] = useState<boolean>(false);

  const { userName, userEmail, userImg } = useUser();
  console.log('userName=>', userName);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setNewUserName(userName);
    setNewUserImg(userImg);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const toggleModal = () => {
  //   setIsModalOpen((prev) => !prev);
  // };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserName(event.target.value);
  };

  const saveUserChanges = async () => {
    try {
      await axios.put('/api/updateUserProfile', {
        userName: newUserName,
        userImg: newUserImg
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveUserChanges();
    closeModal();
  };

  const userToggleButton = () => {
    setIsToggle((modal) => !modal);
  };

  // const handleImageChange = (files) => {
  //   if (files.length > 0) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setNewUserImg(e.target.result);
  //     };
  //     reader.readAsDataURL(files[0]);
  //   }
  // };

  return (
    <>
      <UserWrap>
        <UserInfo onClick={userToggleButton}>
          <div>
            <h1>{userName}</h1>
          </div>
          <img src={userImg} />
        </UserInfo>
        {isToggle && (
          <UserDetailWrap>
            <div>
              <h1>
                Name<span>{userName}</span>
              </h1>
              <h1>
                Email<span>{userEmail}</span>
              </h1>
            </div>
            <div>
              <UserSettingWrap>
                <button onClick={openModal}>
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
        {isModalOpen && (
          <ModalWrap>
            <ModalOverlay onClick={closeModal}> </ModalOverlay>
            <Modal>
              <ModalContent>
                <h2>프로필 수정</h2>
                <img src={userImg} />
                <input
                  id="imgUploader"
                  type="file"
                  accept="image/*"
                  // onChange={(e) => handleImageChange(e.target.files)}
                />
                <form onSubmit={handleSubmit}>
                  <label>
                    User
                    <input type="text" value={newUserName} onChange={handleNameChange} />
                  </label>
                  <button type="submit">저장</button>
                </form>
                <button onClick={closeModal}>닫기</button>
              </ModalContent>
            </Modal>
          </ModalWrap>
        )}
      </UserWrap>
    </>
  );
};
export default Profile;
const ModalWrap = styled.div`
  position: relative;
  left: 0;
  top: 0;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  // z-index: 1;
`;
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  // flex-direction:column;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 99;

  form {
    display: flex;
  }
  input {
    width: 60%;
    background-color: red;
    margin-left: 10px;
  }
`;
const ModalContent = styled.div`
  img {
    border-radius: 10px;
    width: 140px;
  }
  #imgUploader {
    width: 40%;
  }
`;
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
  // z-index: 99;
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
  z-index: 99;
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
    content: '';
    position: absolute;
    right: 18px;
    top: -6px;
    width: 14px;
    height: 14px;
    background-color: #6e6e6e;
    transform: rotate(45deg);
  }
`;
