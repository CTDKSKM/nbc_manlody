import React from 'react';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import useLikes from '../hooks/useLikes';
import Error from './Error';

type Props = {};

const NavLiFavoriteSong = (props: Props) => {
  const navigate = useNavigate();
  const { isLoading, isError, data } = useLikes();

  if (isError) return <Error />;
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <StLiFavoriteSong
          onClick={() => {
            navigate('/favorites');
          }}
        >
          My favorite Song
          {data!.length}
        </StLiFavoriteSong>
      )}
    </>
  );
};

export default NavLiFavoriteSong;

const StLiFavoriteSong = styled.li`
  cursor: pointer;
`;
