import React from 'react'
import { useHistory } from "react-router-dom";
import { Card } from 'react-bootstrap';
import TitleEdit from './TitleEdit';
import callBoardDataApi from '../api-board-data/BoardDataApi';

const BoardCard = props => {
    const history = useHistory();
    const [boardTitle, setBoardTitle] = React.useState(props.Title);
    const renameBoard = async () => {
      console.log(`BoardCard.renameBoard: boardTitle[${boardTitle}] props.Title[${props.Title}]`);
      if (boardTitle !== props.Title) {
        console.log(`BoardCard.renameBoard calling rename board`)
        callBoardDataApi(`BoardData/RenameBoard`,"PATCH",{ Param1: props.BoardId, Param2: boardTitle })
        .then(() => { console.log("renameBoard completed"); props.getBoards() })
        .catch((err) => console.log(`renameBoard failed, err = ${err}`));
      }
    }
    return (
        <Card className='taskcolumn clickable p-0 m-4' 
            key={props.BoardId} 
            onClick={() => history.push(`/board/${props.BoardId}`)}
        >
          <Card.Header className="bg-secondary text-light">
            <TitleEdit
                className="text-dark bg-light font-weight-bold"
                size="sm"
                title={boardTitle} 
                setTitle={setBoardTitle}
                updateTitle={renameBoard}        
            />
          </Card.Header>
        <Card.Body>
          <small>CreatedBy: {props.CreatedBy.email}</small>
          <small>BoardId: {props.BoardId}</small>
        </Card.Body>
      </Card>
    )
}

export default BoardCard
