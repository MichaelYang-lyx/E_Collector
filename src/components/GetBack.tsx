import React from 'react';
import { useNavigate } from 'react-router-dom';

const GetBack = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button onClick={handleBack}>Get Back</button>
    </div>
  );
};
export default GetBack;