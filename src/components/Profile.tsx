import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { signOut } from 'firebase/auth';
import { auth, storage } from '../firebase';
import { TbLogout2 } from 'react-icons/tb';
import useUser from '../hooks/useUser';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { useParams } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsCamera } from 'react-icons/bs';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
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
      if (newUserName.trim() === '') {
        alert('변경할 이름을 입력해주세요.');
        return;
      } else if (newUserName.length > 7) {
        alert('6자 이내로 입력 해주세요.');
        return;
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
                  LogOut
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
  z-index: 99;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  padding: 30px;
  background-color: rgba(57, 57, 57, 0.683);
  box-shadow: 8px 8px 18px rgba(0, 0, 0, 0.422);
  border-radius: 10px;
  z-index: 999;
  h2 {
    margin-bottom: 10px;
  }
  form {
    display: flex;
  }
  input {
    width: 180px !important;
    background-color: #eee;
    margin-bottom: 14px;
    padding-left: 10px !important;
    outline: none;
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
      box-shadow: 8px 8px 10px rgba(0, 0, 0, 0.422);
    }
    label {
      display: flex;
      justify-content: center;
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
    width: 100%;
    height: auto;
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
  padding: 6px 20px;
  border-radius: 8px;
  box-shadow: 8px 8px 18px rgba(0, 0, 0, 0.422);
  transition: background-color 0.5s ease, box-shadow 0.5s ease;

  > img {
    width: 48px;
    height: 48px;
    border-radius: 50px;
    box-shadow: 8px 8px 18px rgba(0, 0, 0, 0.422);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
  }
`;
const UserSettingWrap = styled.div`
  display: flex;
  justify-content: space-between;
  > button {
    cursor: pointer;
    margin: 0;
    color: #eee;
    &:hover {
      color: #fff;
    }
  }
  > div {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #eee;
    font-size: 15px;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
`;
const UserDetailWrap = styled.div`
  position: absolute;
  right: 0;
  top: 72px;
  padding: 25px 30px 12px 30px;
  background: rgba(42, 42, 42, 0.814);
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  z-index: 99;
  > div > h1 {
    font-size: 15px;
    margin-bottom: 6px;
  }
  > div > h1:last-child {
    margin-bottom: 26px;
  }
  > div > h1 > span {
    margin-left: 15px;
  }
  &::before {
    // display: block;
    // content: '';
    // position: absolute;
    // right: 18px;
    // top: -6px;
    // width: 14px;
    // height: 14px;
    // border-width: 8px;
    // border-style: solid;
    // background-color: rgba(42, 42, 42, 0.514);
    transform: rotate(180deg);
    content: '';
    position: absolute;
    top: -16px;
    right: 24px;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(42, 42, 42, 0.814) transparent transparent transparent;
  }

  // content: '';
  // position: absolute;
  // top: 98%;
  // right: 24px;
  // border-width: 8px;
  // border-style: solid;
`;

const ProfileBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  > div > button {
    display: inline-block;
    padding: 8px 20px;
    background: #868686;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
`;
