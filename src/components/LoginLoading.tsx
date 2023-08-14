import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const rainbowAnimation = keyframes`
  0% {
    border-top: 4px solid red;
  }
  14% {
    border-top: 4px solid orange;
  }
  28% {
    border-top: 4px solid yellow;
  }
  42% {
    border-top: 4px solid green;
  }
  57% {
    border-top: 4px solid blue;
  }
  71% {
    border-top: 4px solid indigo;
  }
  85% {
    border-top: 4px solid violet;
  }
  100% {
    border-top: 4px solid red;
  }
`;

const waveAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(70, 70, 70, 0.785);
  z-index: 1000;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    // background-color: black;
    filter: blur(20px);
  }

  h2 {
    margin-top: 20px;
    color: orange;
    font-size: 24px;
    text-align: center;
    animation: ${waveAnimation} 1s infinite;
  }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid transparent;
  border-top: 4px solid red;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite, ${rainbowAnimation} 7s linear infinite;
`;

const LoginLoading = () => {
  return (
    <LoadingContainer>
      <Spinner />
      <h2>What is your orange?</h2>
    </LoadingContainer>
  );
};

export default LoginLoading;
