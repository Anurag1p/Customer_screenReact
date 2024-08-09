import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainScreen from './MainScreen';
import NotFound from './NotFoundPage';

const MainScreenWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const Id = parseInt(id);
  
  if (isNaN(Id)) {
    return <NotFound/>
  } else {
    return <MainScreen id={Id} />;
  }
};

export default MainScreenWrapper;
