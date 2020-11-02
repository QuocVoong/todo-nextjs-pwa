import React, { useState }                      from 'react';
import { get }                                  from 'lodash';
import Link                                     from 'next/link';
import { useQuery, useMutation, useQueryCache } from 'react-query';
import { FaTimesCircle }                        from 'react-icons/fa';
import Button                                   from '../components/Button';
import styled                                   from 'styled-components';
import { findBoards }                           from './api/query';
import { createBoard, deleteBoard }             from './api/mutation';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HomeTitle = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const StyledLink = styled.a`
  &:hover,
  &:focus,
  &:active {
    opacity: 0.85;
  }
`;

const StyledForm = styled.form`
  margin: 12px 0 0 0;
  width: 100%;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledOr = styled.div`
  margin: 8px 0;
  font-size: 14px;
  font-weight: 500;
`;

const StyledInput = styled.input`
  width: 400px;
  color: rgb(46, 68, 78);
  border-radius: 4px;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
  resize: none;
  font-size: 16px;
  margin-right: 12px;

  &:hover,
  &:focus,
  &:active {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
  }
`;

const List = styled.div`
  margin: 1rem 0;
  padding: 12px 12px 12px;
  background: #f8f8f8;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  width: 500px;

  @media (max-width: 768px) {
    width: 320px;
    font-size: 14px;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 0;
`;

const StyledDeleteBoardButton = styled.button`
  border: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
  color: rgb(46, 68, 78);
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;

  &:hover,
  &:focus,
  &:active {
    color: #da3849;
    opacity: 1;
  }
`;

const BoardList = ({ boards, isLoading, onDeleteBoard }) => {
  const handleDeleteBoard = (event, boardId) => {
    event.preventDefault();
    onDeleteBoard(boardId);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {boards && boards.map((board) => (
        <Row key={`row-${board._id}`}>
          <Link href="board/[id]" as={`board/${board._id}`}><a>{board.title}</a></Link>
          <StyledDeleteBoardButton onClick={(e) => handleDeleteBoard(e, board._id)}>
            <FaTimesCircle size={18}/>
          </StyledDeleteBoardButton>
        </Row>
      ))}
    </>
  );
};

export default function Home({ initialData }) {
  const [newBoardTitle, setNewBoardTitle]             = useState('');
  const { data, status, isLoading }                   = useQuery('boards', findBoards, {
    initialData,
    refetchOnWindowFocus: false,
  });
  const boards                                        = get(data, 'result.data');
  const cache                                         = useQueryCache();
  const [createBoardMutate, { error: creatingError }] = useMutation(createBoard, {
    onSuccess: () => {
      cache.invalidateQueries('boards');
      setNewBoardTitle('');
    },
  });

  const [deleteBoardMutate, { error: deleteError }] = useMutation(deleteBoard, {
    onSuccess: () => {
      cache.invalidateQueries('boards');
    },
  });

  const handleTitleChange = (event) => setNewBoardTitle(event.target.value);

  const handleAddBoard = async (event) => {
    event.preventDefault();
    onAddBoard(newBoardTitle);
  };

  const onAddBoard = async (boardTitle) => {
    await createBoardMutate({ formData: { title: boardTitle } });
  };

  const onDeleteBoard = async (boardId) => {
    await deleteBoardMutate({ formData: { _id: boardId } });
  };

  if (isLoading) return 'Loading...';

  return <StyledHome>
    <HomeTitle>Pick a board...</HomeTitle>
    <List>
      <BoardList boards={boards} isLoading={isLoading} onDeleteBoard={onDeleteBoard}/>
      <StyledForm onSubmit={(e) => handleAddBoard(e, newBoardTitle)}>
        <FormRow>
          <StyledInput value={newBoardTitle} onChange={(e) => handleTitleChange(e)} placeholder="Add a new board"/>
          <Button variant="board" type="submit" value="Submit" text="Add" disabled={!newBoardTitle || isLoading}/>
        </FormRow>
      </StyledForm>
    </List>
  </StyledHome>;
}

export async function getServerSideProps() {
  const initialData = await findBoards({});
  return { props: { initialData } };
}

