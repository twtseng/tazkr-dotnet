import React from 'react'
import {  Button, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import AppContext from '../AppContext';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { HubMethod } from '../api-board-data/SignalRHub';
import reduxDragEndHandler from '../dragdrop/ReduxBoardViewDragEndHandler';
import TaskCard from '../view-components/TaskCard';
import BoardColumn from '../view-components/BoardColumn';
import UsersCard from '../view-components/UsersCard';
import BoardStatusBar from '../view-components/BoardStatusBar';
import ChatCard from '../view-components/ChatCard';
import { Board, Column, BoardPermissionLevel } from '../view-components/TazkrObjects';

import {
    setBoard,
    getBoard,
    selectBoard,
    moveTaskToColumn
} from '../features/board/boardSlice'

const ReduxBoardView = () => {
    interface ParamTypes {
        boardId: string
    }
    const { boardId } = useParams<ParamTypes>();
    const board = useSelector(selectBoard);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getBoard(boardId))
    },[]);
    const updateBoard = (updatedBoard: Board) => {
        alert(JSON.stringify(updatedBoard));
        dispatch(setBoard(updatedBoard));
    }
    const refetchBoard = () => {
        dispatch(getBoard(boardId))
    }
    const dragCard = (result: DropResult) => {
      if (result.destination !== null) {
        const taskId:string = result.draggableId;
        const fromColId:string = result.source.droppableId;
        const toColId:string = result.destination !== undefined ? result.destination.droppableId : "";
        const fromIndex:number = result.source.index;
        const toIndex:number = result.destination !== undefined ? result.destination.index : -1;

        dispatch(moveTaskToColumn({taskId, fromColId, toColId, fromIndex, toIndex}))
        BoardDataApi.moveCardToColumnAtIndex(taskId, toColId, toIndex);
      }
    }
    return (
        board === null 
        ? <></>
        : (
        <DragDropContext onDragEnd={(result) => dragCard(result)}>
        <div className="p-0 col-12 d-flex h-100">
          <div className="p-0 pl-md-3 pr-md-3 col-md-10 h-100"> 
            <Card className="d-flex flex-column bg-light h-100">
              <Card.Header className="bg-secondary text-light">   
                <BoardStatusBar board={board} getBoard={refetchBoard} boardTitle={board.Title} setBoardTitle={(title:string) => {}} permissionLevel={board.PermissionLevel} />
              </Card.Header>
              <Card.Body
                className="d-flex flex-nowrap bg-dark"
                style={{overflowX:"scroll"}}>
                {board.Columns.map(col => 
                  <BoardColumn key={col.UpdateHashCode} HashCode={col.UpdateHashCode} Title={col.Title} Index={col.Index} ColumnId={col.Id} getBoard={refetchBoard} BoardId={boardId}>
                      {col.Cards.map((t, index) =>
                        <TaskCard 
                          key={t.UpdateHashCode}
                          HashCode={t.UpdateHashCode}
                          Title={t.Title} 
                          CardId={t.Id} 
                          Index={index} 
                          Description={t.Description} 
                          getBoard={refetchBoard}
                          BoardId={boardId}
                          />
                      )}
                  </BoardColumn>
                )}
              </Card.Body> 
            </Card>
          </div>
          <Card className="col-2 bg-light p-0 h-100 d-none d-md-flex">
            <Card className="mb-2">
              <Card.Header className="bg-secondary text-light">Owner</Card.Header>
              <Card.Body>
                <small>{board.CreatedBy.UserName}</small>
              </Card.Body> 
            </Card>
            <UsersCard board={board} getBoard={refetchBoard} />
            <ChatCard ChatId={boardId} />
          </Card>
        </div>
      </DragDropContext> 
        )
    )
}

export default ReduxBoardView
