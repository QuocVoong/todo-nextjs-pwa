import React, {Component} from 'react';
import styled from 'styled-components';

const StyledListTitleButton = styled.button`
  flex-grow: 1;
  padding: 10px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  background: #f8f8f8;
  color: rgb(46, 68, 78);
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-top-left-radius: 3px;
`;

export const ListTitleButton = ({text, ...props}) => {
  return <StyledListTitleButton {...props}>{text}</StyledListTitleButton>;
};

export default ListTitleButton;
