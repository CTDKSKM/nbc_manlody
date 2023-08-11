import React from 'react';
import { useQuery } from 'react-query';
import { getLikes } from '../api/likes';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import useLikes from '../hooks/useLikes';

type Props = {};

const NavLiFavoriteSong = (props: Props) => {
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery(['likes'], getLikes);
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
          My favorite Song{data!.length}
        </StLiFavoriteSong>
      )}
    </>
  );
};

export default NavLiFavoriteSong;

const StLiFavoriteSong = styled.li`
  cursor: pointer;
`;
