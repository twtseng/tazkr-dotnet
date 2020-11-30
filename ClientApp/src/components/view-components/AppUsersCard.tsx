import React from 'react'
import * as BoardDataApi from '../api-board-data/BoardDataApi';
import AppContext from '../AppContext';
import { Card } from 'react-bootstrap';
import { HubMethod } from '../api-board-data/SignalRHub';
import { User } from './TazkrObjects';

const AppUsersCard = () => {

    const signalRHub = React.useContext(AppContext);
    const [appUsers, setAppUsers] = React.useState([]);
    const refreshAppUsers = async () => {
        const users = await BoardDataApi.getUsers();
        const sortedUsers = users.sort(
            (a:User,b:User) => {
                if (a.Online == b.Online) {
                    return a.UserName < b.UserName ? -1 : 1;
                } else {
                    return a.Online ? -1 : 1;
                }
            });
        setAppUsers(sortedUsers);        
    }
    const updateAppUsers: HubMethod = async (arg1:any, arg2: any, arg3: any, arg4:any )=> {
        await refreshAppUsers();
    }
    const joinChat = async () => {
        await signalRHub.setMethod("UpdateAppUsers", updateAppUsers);
        await signalRHub.joinChat("TazkrApp");       
    }
    React.useEffect(() => {
        joinChat();
        refreshAppUsers();
    },[]);
    return (
        <Card className="mb-2 h-25">
            <Card.Header className="bg-secondary text-light">
                Users
            </Card.Header>
            <Card.Body style={{overflowX:"hidden", backgroundColor:"lightgray", overflowY:"scroll"}}>
                {appUsers.map((x:User) => (
                    <div key={x.Id}><span style={{verticalAlign:"middle", color: x.Online ? "lightseagreen" : "darkgray"}}>&#8226; </span>
                        <small style={{verticalAlign:"middle"}}>{x.UserName}</small>
                    </div>
                ))}
            </Card.Body>
        </Card>
    )
}

export default AppUsersCard
