import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(46, 68, 78);
  line-height: 18px;
  border: none;
  transition-duration: 0.085s;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: ${({variant}) => (variant === 'list' ? '5px' : '3px')};
  font-weight: ${({variant}) => (variant === 'list' ? '600' : '500')};
  font-size: ${({variant}) => (['list', 'board', 'example'].includes(variant) && '14px') || '13px'};
  margin: ${({variant}) => (variant === 'list' ? '8px' : '0')};
  width: ${({variant}) => (variant === 'list' && '268px') || (variant === 'board' && '70px') || 'auto'};
  height: ${({variant}) =>
  (variant === 'list' && '48px') || (['board', 'example'].includes(variant) && '34px') || 'auto'};
  transition-timing-function: ease-in;
  background-color: ${({variant}) =>
  (variant === 'card' && '#fcd1f0') ||
  (variant === 'list' && '#fcddd1') ||
  (variant === 'board' && '#d1f7c4') ||
  (variant === 'add' && '#d1f7c4') ||
  (variant === 'example' && '#fcb400') ||
  '#fff'};

  &:hover,
  &:focus,
  &:active {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  &:disabled {
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const Button = ({text, ...props}) => {
  return <StyledButton {...props}>{text}</StyledButton>;
};

export default Button;
