import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Ellipse = styled.span`
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 0.2rem;
  animation: ${rotate} 1s infinite ease-in-out; 

  &:nth-child(2) {
    animation-delay: 0.33s;
  }

  &:nth-child(3) {
    animation-delay: 0.66s;
  }
`;

const Ellipses = ({ numberOfDots = 3 }) => {
  const ellipses = [];
  for (let i = 0; i < numberOfDots; i++) {
    ellipses.push(<Ellipse key={i} />);
  }
  return <span>{ellipses}</span>;
};

export default Ellipses;