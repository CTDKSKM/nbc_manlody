import React from 'react';
import { useQuery } from 'react-query';
import { getLikes } from '../api/likes';
import Loading from './Loading';

type Props = {};

const FavoriteSong = (props: Props) => {
  const { isLoading, isError, data } = useQuery(['likes'], getLikes);

  return <>{isLoading ? <Loading /> : <li>My favorite Song{data!.length}</li>}</>;
};

export default FavoriteSong;
