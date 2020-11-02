import React, { useState, useEffect }           from 'react';
import styled                                   from 'styled-components';
import { find, findIndex, cloneDeep }           from 'lodash';
import { useRouter }                            from 'next/router';
import {
  DragDropContext,
  Droppable,
  Draggable
}                                               from 'react-beautiful-dnd';
import {
  ListCard,
  ListAdder,
  ListTitleTextarea,
  ListTitleButton,
  DeleteListButton,
  CardTextarea,
  DeleteCardButton,
  EditCardButton,
  Button
}                                               from '../../components';
import { findBoard }                            from '../api/query';
import {
  createTotoList,
  deleteTodoList,
  createCard,
  reorderBoard,
  reorderList,
  editTodoList,
  deleteCard, editCard
}                                               from '../api/mutation';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import Link                                     from 'next/link';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 111px);
  overflow-x: auto;
  overflow-y: auto;

  @media (max-width: 1436px) {
    align-items: ${(props) => props.numLists > 3 && 'self-start'};
  }

  @media (max-width: 1152px) {
    align-items: ${(props) => props.numLists > 2 && 'self-start'};
  }

  @media (max-width: 868px) {
    align-items: ${(props) => props.numLists > 1 && 'self-start'};
  }

  @media (max-width: 768px) {
    align-items: center;
    height: 100%;
  }
`;

const BoardTitle = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const BoardTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ListsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 10px;
`;

const ListTitleTextareaWrapper = styled.div`
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
`;

const CardTextareaWrapper = styled(TextareaWrapper)`
  margin: 0 10px 10px 10px;
`;

const ComposerWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: #f8f8f8;
  padding: 0 0 10px 0;
  border: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const ListTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 48px;
  align-items: center;
  color: rgb(46, 68, 78);
`;

const CardTitle = styled.div`
  background: white;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
  margin: 0 10px 10px 10px;
  padding: 8px;
  border-radius: 5px;
  position: relative;
  overflow-wrap: break-word;
  overflow: visible;
  word-wrap: break-word;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover,
  &:active,
  &:focus {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
  }
`;

const ButtonWrapper = styled.div`
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const List = ({ list, onDeleteList, onEditListTitle, onSubmitCard, onEditCard, onDeleteCard }) => {
  const [newCardFormIsOpen, setNewCardFormIsOpen] = useState(false);
  const [isListTitleInEdit, setIsListTitleInEdit] = useState(false);
  const [isLoading, setIsLoading]                 = useState(false);
  const [cardInEdit, setCardInEdit]               = useState(null);
  const [newCardTitle, setNewCardTitle]           = useState('');
  const [newListTitle, setNewListTitle]           = useState('');
  const [tempCardTitle, setTempCardTitle]         = useState('');

  const toggleCardComposer = () => setNewCardFormIsOpen(!newCardFormIsOpen);

  const handleCardComposerChange = (event) => {
    setNewCardTitle(event.target.value);
  };

  const handleKeyDown = (event, callback) => {
    if (event.keyCode === 13) {
      callback(event);
    }
  };

  const handleSubmitCard = (event) => {
    event.preventDefault();
    setNewCardFormIsOpen(false);
    if (newCardTitle.length < 1) return;
    addNewCard(list._id, newCardTitle);
  };

  const openCardEditor = (event, card) => {
    event.preventDefault();
    setCardInEdit(card._id);
    setTempCardTitle(card.title);
  };

  const handleCardEditorChange = (event) => {
    setTempCardTitle(event.target.value);
  };

  const handleListTitleChange = (event) => {
    setNewListTitle(event.target.value);
  };

  const handleCardEdit = async (e) => {
    e.preventDefault();
    if (tempCardTitle.length < 1) {
      await onDeleteCard({ listId: list._id, cardId: cardInEdit });
    } else {
      const card = find(list.cards, { _id: cardInEdit });
      if (card.title != tempCardTitle) {
        card.title = tempCardTitle;
        await onEditCard({
          cardTitle: tempCardTitle.trim(),
          cardId:    cardInEdit,
          cardIndex: findIndex(list.cards, { _id: cardInEdit }),
          listId:    list._id,
        });
      }
    }
    setTempCardTitle('');
    setCardInEdit(null);
  };

  const handleDeleteCard = (event, cardId) => {
    event.preventDefault();
    onDeleteCard({ listId: list._id, cardId });
  };

  const openTitleEditor = () => {
    setIsListTitleInEdit(true);
    setNewListTitle(list.title);
  };

  const handleSubmitListTitle = async () => {
    if (newListTitle.length < 1 || newListTitle === list.title) {
      setIsListTitleInEdit(false);
      return;
    }

    setIsListTitleInEdit(true);
    list.title = newListTitle;
    await onEditListTitle({ listTitle: newListTitle, listId: list._id });
    setNewListTitle('');
    setIsListTitleInEdit(false);
  };

  const handleDeleteList = (event) => {
    event.preventDefault();
    onDeleteList(list._id);
  };

  const addNewCard = async (listId, newCardTitle) => {
    await onSubmitCard(listId, newCardTitle);
    setNewCardTitle('');
  };

  const cards = list.cards;

  return (
    <ListCard>
      {isListTitleInEdit ? (
        <ListTitleTextareaWrapper>
          <ListTitleTextarea
            value={newListTitle}
            onChange={handleListTitleChange}
            onKeyDown={(e) => handleKeyDown(e, handleSubmitListTitle)}
            onBlur={handleSubmitListTitle}
          />
        </ListTitleTextareaWrapper>
      ) : (
        <ListTitle>
          <ListTitleButton onFocus={openTitleEditor} onClick={openTitleEditor} text={list.title}/>
          <DeleteListButton onClick={(e) => handleDeleteList(e)}/>
        </ListTitle>
      )}
      <Droppable droppableId={list._id}>
        {(provided) => (
          <div ref={provided.innerRef}>
            {(cards || []).map((card, index) => (
              <Draggable key={card._id} draggableId={card._id} index={index}>
                {({ innerRef, draggableProps, dragHandleProps, placeholder }) => (
                  <div>
                    {cardInEdit !== card._id ? (
                      <CardTitle
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                        data-react-beautiful-dnd-draggable="0"
                        data-react-beautiful-dnd-drag-handle="0">
                        {card.title}
                        <ButtonWrapper>
                          <DeleteCardButton onClick={(e) => handleDeleteCard(e, card._id)}/>
                          <EditCardButton onClick={(e) => openCardEditor(e, card)}/>
                        </ButtonWrapper>
                      </CardTitle>
                    ) : (
                      <TextareaWrapper ref={innerRef} {...draggableProps} {...dragHandleProps}>
                        <CardTextarea
                          value={tempCardTitle}
                          onChange={handleCardEditorChange}
                          onKeyDown={(e) => handleKeyDown(e, handleCardEdit)}
                          onBlur={handleCardEdit}
                        />
                      </TextareaWrapper>
                    )}
                    {placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {(newCardFormIsOpen || isLoading) && (
              <CardTextareaWrapper>
                <CardTextarea
                  value={newCardTitle}
                  onChange={handleCardComposerChange}
                  onKeyDown={(e) => handleKeyDown(e, handleSubmitCard)}
                  onBlur={handleSubmitCard}
                />
                <Button variant="add" onClick={handleSubmitCard} text="Add" disabled={newCardTitle === ''}/>
              </CardTextareaWrapper>
            )}
            {!newCardFormIsOpen &&
            !isLoading && (
              <ComposerWrapper>
                <Button variant="card" text="Add new card" onClick={toggleCardComposer}>
                  Add new card
                </Button>
              </ComposerWrapper>
            )}
          </div>
        )}
      </Droppable>
    </ListCard>
  );
};

export default function Board({ initialData }) {
  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    if (initialData) {
      setTodoList(initialData.result.data[0].todo_list);
    }
  }, [initialData]);

  const [showListAdder, setShowListAdder] = useState(false);
  const [newListTitle, setNewListTitle]   = useState('');
  const cache                             = useQueryCache();
  const router                            = useRouter();
  const { id: boardId }                   = router.query;

  const { data: boardData, isLoading: isBoardLoading } = useQuery(['board', boardId], () => boardId && findBoard({ boardId }), {
    initialData:          initialData,
    refetchOnWindowFocus: false,
    onSuccess:            (data) => {
      if (data.result.data) {
        setTodoList(data.result.data[0].todo_list);
      }
    },
  });

  const [reorderBoardMutate, { error: reorderBoardError }] = useMutation(reorderBoard, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  const [createTodoListMutate, { error: creatingTodoListError }] = useMutation(createTotoList, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
      setShowListAdder(false);
      setNewListTitle('');
    },
  });

  const [editTodoListMutate, { error: editingTodoListError }] = useMutation(editTodoList, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  const [deleteTodoListMutate, { error: deletingTodoListError }] = useMutation(deleteTodoList, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  const [createCardMutate, { error: creatingCardError }] = useMutation(createCard, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  const [editCardMutate, { error: editingCardError }] = useMutation(editCard, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  const [deleteCardMutate, { error: deletingCardError }] = useMutation(deleteCard, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  const [reorderListMutate, { error: reorderListError }] = useMutation(reorderList, {
    onSuccess: () => {
      cache.invalidateQueries(['board', boardId]);
    },
  });

  if (isBoardLoading) return 'Loading...';

  const board = boardData.result.data[0];

  const handleDragEnd = async ({ draggableId, source, destination, type }) => {
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'COLUMN') {
      const newLists      = Array.from(todoList);
      const [removedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removedList);
      setTodoList(newLists);
      await reorderBoardMutate({
        formData: {
          source_id:         boardId,
          list_id:           draggableId,
          source_index:      source.index,
          destination_index: destination.index
        }
      });
      return;
    } else {
      const newLists = cloneDeep(todoList);
      if (source.droppableId === destination.droppableId) {
        const newCards      = find(newLists, { _id: source.droppableId }).cards;
        const [removedCard] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, removedCard);
      } else {
        const sourceCards      = find(newLists, { _id: source.droppableId }).cards;
        const [removedCard]    = sourceCards.splice(source.index, 1);
        const destinationCards = find(newLists, { _id: destination.droppableId }).cards;
        destinationCards.splice(destination.index, 0, removedCard);
      }
      setTodoList(newLists);
      await reorderListMutate({
        formData: {
          source_id:         source.droppableId,
          card_id:           draggableId,
          destination_id:    destination.droppableId,
          source_index:      source.index,
          destination_index: destination.index,
          board_id:          boardId
        }
      });
    }
  };

  const handleAddList = async () => {
    await createTodoListMutate({ formData: { board_id: boardId, title: newListTitle } });
  };

  const handleDeleteList = async (listId) => {
    await deleteTodoListMutate({ formData: { board_id: boardId, list_id: listId } });
  };

  const handleEditListTitle = async ({ listTitle, listId }) => {
    await editTodoListMutate({ formData: { board_id: boardId, list_id: listId, list_title: listTitle } });
  };

  const handleSubmitCard = async (listId, cardTitle) => {
    await createCardMutate({ formData: { board_id: boardId, list_id: listId, title: cardTitle } });
  };

  const handleEditCard = async ({ cardTitle, cardIndex, listId }) => {
    return editCardMutate({
      formData: {
        card_title: cardTitle,
        card_index: cardIndex,
        list_id:    listId,
        board_id:   boardId
      }
    });
  };

  const handleDeleteCard = async ({ listId, cardId }) => {
    await deleteCardMutate({ formData: { board_id: boardId, list_id: listId, card_id: cardId } });
  };

  return <>
    <BoardTitleWrapper>
      <BoardTitle>
        <Link href="/" as={`/`}><a style={{ padding: 30, textDecoration: 'none' }}> &lt; &lt; </a></Link>
        {board.title}
      </BoardTitle>
    </BoardTitleWrapper>
    <StyledBoard numLists={todoList.length}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={boardId} type="COLUMN" direction="horizontal">
          {(droppableProvided) => (
            <ListsWrapper ref={droppableProvided.innerRef}>
              {todoList.map((list, index) => (
                <Draggable key={list._id} draggableId={list._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      data-react-beautiful-dnd-draggable="0"
                      data-react-beautiful-dnd-drag-handle="0">
                      <List
                        list={list}
                        boardId={boardId}
                        onEditListTitle={handleEditListTitle}
                        onDeleteList={handleDeleteList}
                        onSubmitCard={handleSubmitCard}
                        onEditCard={handleEditCard}
                        onDeleteCard={handleDeleteCard}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
              {todoList.length < 5 && (
                <ListAdder
                  numLeft={5 - todoList.length}
                  onAddList={handleAddList}
                  showListAdder={showListAdder}
                  setShowListAdder={setShowListAdder}
                  newListTitle={newListTitle}
                  setNewListTitle={setNewListTitle}
                />
              )}
            </ListsWrapper>
          )}
        </Droppable>
      </DragDropContext>
    </StyledBoard>
  </>;
};

export async function getServerSideProps({ query }) {
  const { id: boardId } = query;
  const board           = await findBoard({ boardId });
  return { props: { initialData: board } };
}
