import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; /* Or a specific height */
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
  z-index: 1000;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite; /* Spin animation */
`;

interface LoaderProps {
    isLoading: boolean
}

const Loader = ({ isLoading }: LoaderProps) => {
    if (!isLoading) {
        return null
    }

    return (
        <LoaderContainer>
            <Spinner />
        </LoaderContainer>
    );
};

export default Loader;