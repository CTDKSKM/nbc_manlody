import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { signOut } from 'firebase/auth';
import { auth, storage } from '../firebase';
import { TbLogout2 } from 'react-icons/tb';
import useUser from '../hooks/useUser';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { useParams } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsCamera } from 'react-icons/bs';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserImg, setNewUserImg] = useState<string>('');
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [selectefFile, setselectefFile] = useState<any>('');

  const { userName, userEmail, userImg, setUserProfile } = useUser();
  const [modalUserImg, setModalUserImg] = useState<any>(userImg);

  const params = useParams();
  useEffect(() => {
    setIsToggle(false);
  }, [params]);

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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserName(event.target.value);
  };

  const saveUserChanges = async () => {
    try {
      let imageUrl = userImg;
      if (selectefFile) {
        const storageRef = ref(storage, `profile/${selectefFile.name}`);
        await uploadBytes(storageRef, selectefFile);
        imageUrl = await getDownloadURL(storageRef);
        setModalUserImg(imageUrl);
      }
      setUserProfile(newUserName, imageUrl);
      closeModal();
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveUserChanges();
    //closeModal();
  };

  const userToggleButton = () => {
    setIsToggle(!isToggle);
    setModalUserImg(userImg);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setselectefFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setModalUserImg(e.target!.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

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
                  <IoSettingsOutline size={18} />
                </button>
                <div onClick={handleSignOut}>
                  <span>
                    <TbLogout2 size={18} />
                  </span>
                  <p>LogOut</p>
                </div>
              </UserSettingWrap>
            </div>
          </UserDetailWrap>
        )}
        {isModalOpen && (
          <ModalWrap>
            <ModalOverlay onClick={closeModal}> </ModalOverlay>
            <Modal>
              <ModalInner>
                <h2>프로필 수정</h2>
                <div className="modal_img">
                  <p>
                    <img src={modalUserImg} />
                  </p>
                  <div>
                    <label htmlFor="imgUploader">
                      <BsCamera size={18} />
                    </label>
                    <input style={{ display: 'none' }} id="imgUploader" type="file" onChange={handleImageChange} />
                  </div>
                </div>

                <div>
                  {/* <label>User</label> */}
                  <input type="text" value={newUserName} onChange={handleNameChange} />
                </div>
                <ProfileBtnWrap>
                  <div>
                    <button type="submit" onClick={handleSubmit}>
                      저장
                    </button>
                  </div>
                  <div>
                    <button onClick={closeModal}>닫기</button>
                  </div>
                </ProfileBtnWrap>
              </ModalInner>
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
  z-index: 1;
`;
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 22%;
  background-color: #4e4e4e;
  padding: 20px;
  border-radius: 10px;
  z-index: 99;

  form {
    display: flex;
  }
  input {
    width: 60%;
    background-color: #fff;
    margin-bottom: 20px;
  }
`;
const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  .modal_img {
    margin: 20px auto;
    position: relative;
    left: 0;
    top: 0;
    p {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      left: 0;
      top: 0;
    }
    label {
      display: flex;
      align-items: center;
      position: absolute;
      right: 2px;
      bottom: 2px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ffffff;
      cursor: pointer;
    }
  }
  img {
    /* border-radius: 10px; */
    width: 100%;
    height: auto;
    /* margin-left: auto;
    margin-right: auto; */
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

const ProfileBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  > div > button {
    display: inline-block;
    padding: 8px 16px;
    background: #999;
    border-radius: 4px;
  }
`;
