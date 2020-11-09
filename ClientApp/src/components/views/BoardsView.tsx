import React from 'react';
import {  Button, Card } from 'react-bootstrap'
import AppContext from '../AppContext';
import callBoardDataApi from '../api-board-data/BoardDataApi';
import { SignalRHub, HubMethod } from '../api-board-data/SignalRHub';
import BoardCard from '../view-components/BoardCard';
import { Board, User } from '../view-components/TazkrObjects';

const BoardsView = () => {

  const [boards, setBoards] = React.useState([]);
  const { signalRHub } = React.useContext(AppContext);
  const getBoards = async () => {
      const boardsData = await callBoardDataApi("BoardData/GetBoards","GET");
      boardsData.sort((a:Board,b:Board) => { return (new Date(a.CreatedDateUTC)) > (new Date(b.CreatedDateUTC)) ? 1 : -1 });
      setBoards(boardsData);
  }
  const createBoard = async () => {
    const boardsData = await callBoardDataApi("BoardData/CreateBoard","PUT", { Param1: "New Board" });
    getBoards();
  }
  const [boardUsers, setBoardUsers] = React.useState([]);
  const updateAppUsers: HubMethod = (arg1:any, arg2: any, arg3: any, arg4:any )=> {
    console.log( `UpdateAppUsers: ${JSON.stringify(arg1)}`);
    setBoardUsers(arg1);
  }
  React.useEffect(() => {
    signalRHub.setMethod("UpdateAppUsers", updateAppUsers);
    getBoards();
  },[]);
  return (
    <div className="col-12 d-flex">
      <div className="col-10 h-100">
        <Card className="d-flex flex-column bg-light h-100">
          <Card.Header className="bg-secondary text-light"> 
            <Button onClick={createBoard}>Add a Board</Button>
          </Card.Header>
          <Card.Body>
            <h6>Boards</h6>
            <div className="d-flex flex-wrap justify-content-start">
              {boards.map((x: Board) => 
                <BoardCard key={x.UpdateHashCode} Title={x.Title} BoardId={x.Id} CreatedBy={x.CreatedBy} getBoards={getBoards} />
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
      <Card className="col-2 bg-light">
        <Card.Body>
          <h6>Users</h6>
          {boardUsers.map((x: User) =>
            <div>{x.UserName}</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default BoardsView;