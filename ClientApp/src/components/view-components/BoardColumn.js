import React from 'react'
import { Card, Form, Dropdown } from 'react-bootstrap'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import callBoardDataApi from '../api-board-data/BoardDataApi';
import TitleEdit from './TitleEdit';

const TaskList = styled.div`
    padding: 8px;
    flex-grow: 1;
    background-color: ${props => (props.isDraggingOver ? 'lightgray' : 'white')};
    border-radius: 10px;
`;

const BoardColumn = (props) => {
    const [columnTitle, setColumnTitle] = React.useState(props.Title)
    const updateColumnTitle = () => {
        console.log(`updateColumnTitle: columnTitle=[${columnTitle}] props.Title:[${props.Title}]`)
        if (columnTitle !== props.Title) {
            console.log(`updateColumnTitle updating the column in the db...`)
            callBoardDataApi(`BoardData/RenameColumn`,"PATCH",{ Param1: props.ColumnId, Param2: columnTitle })
            .then(() => { console.log("updateColumnTitle completed"); props.getBoard(); })
            .catch((err) => console.log(`updateColumnTitle failed, err = ${err}`));
        }
    }
    const deleteColumn = async () => {
        await callBoardDataApi(`BoardData/DeleteColumn`,"DELETE",{ Param1: props.ColumnId });
        props.getBoard();
      }
    const addCardToColumn = () => {   
        callBoardDataApi(`BoardData/AddCardToColumn`,"PUT",{ Param1: props.ColumnId, Param2: "New Task" })
        .then(() => {
            console.log("addCardToColumn completed");
            props.getBoard();
        })
        .catch((err) => console.log(`addCardToColumn failed, err = ${err}`));
    }
    return (
        <Card className='mr-2 p-0 taskcolumn' style={{height: "100%"}}> 
            <Card.Header className="bg-secondary text-light">   
                <div className="TitleRow d-flex justify-content-between align-baseline">
                    <div className="TitleEdit align-text-bottom">
                        <TitleEdit
                            className="text-dark bg-light font-weight-bold"
                            size="sm"
                            title={columnTitle} 
                            setTitle={setColumnTitle}
                            updateTitle={updateColumnTitle}        
                        />
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle className="text-light" variant="muted" id="dropdown-basic">
                            <small>Column actions</small>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={addCardToColumn}><small>Add Card</small></Dropdown.Item>
                            <Dropdown.Item onClick={deleteColumn}><small>Delete Column</small></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                </Card.Header> 
                <Card.Header>
                    HashCode: {props.HashCode}
                </Card.Header> 
                <Card.Body style={{minHeight:"200px", maxHeight:"100%", display:"block", overflowY:"scroll"}}>
                <div style={{minHeight:"100%", display:"flex"}}>
                    <Droppable droppableId={props.ColumnId} type={"ColumnDroppable"}>
                        { (provided, snapshot) => (
                            <TaskList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                { props.children }
                                {provided.placeholder}
                            </TaskList>
                        )}
                    </Droppable>
                </div>
            </Card.Body>
        </Card>
    )
}

export default BoardColumn
