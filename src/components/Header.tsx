import React, { useEffect, useRef } from "react";
import Profile from "./Profile";
import { styled } from "styled-components";
import {
    SearchOutlined,
    StepForwardOutlined,
    StepBackwardOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Header: React.FC = () => {
    // const searchIconRef = useRef<HTMLSpanElement | null>(null);
    // const searchInputRef = useRef<HTMLSpanElement | null>(null);

    // useEffect(() => {
    //     if (searchInputRef.current) {
    //         searchInputRef.current.focus(); // 컴포넌트 마운트 시 자동 포커스
    //     }
    // }, []);

    // const handleInputFocus = () => {
    //     if (searchIconRef.current) {
    //         searchIconRef.current.style.opacity = "0";
    //     }
    //     if (searchInputRef.current) {
    //         searchInputRef.current.style.transform = "translate(-30px)";
    //     }
    // };
    const handleSignOut = async () => {
    await signOut(auth);
  };
    return (
        <HeaderTag>
            <Space style={{ gap: "4px" }}>
                <Tooltip title="next">
                    <Button shape="circle" icon={<StepBackwardOutlined />} />
                </Tooltip>
                <Tooltip title="forward">
                    <Button shape="circle" icon={<StepForwardOutlined />} />
                </Tooltip>
            </Space>
            <form>
                <label>
                    <SearchOutlined />
                </label>
                <input
                    type="text"
                    placeholder="검색어를 입력해 주세요."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            // 엔터 키가 눌렸을 때 검색 로직
                        }
                    }}
                    // onFocus={handleInputFocus}
                    // ref={searchInputRef}
                />
            </form>
            <div>
               <button onClick={handleSignOut}>로그아웃</button>
                <Profile />
            </div>
        </HeaderTag>
    );
};

export default Header;

const HeaderTag = styled.header`
    width: 100%;
    // margin: 0 auto;
    // margin-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    border: 1px dotted gray;
    padding: 1.5rem 0;

    input {
        padding: 10px;
        width: 200px;
        border: none;
        border-radius: 8px;
    }
`;
