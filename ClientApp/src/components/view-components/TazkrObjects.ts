export type User = {
    Id: string;
    UserName: string;
    Email: string;
}
export type TaskObj = {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    Description: string;
    Index: number;
}

export type Column = {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    Description: string;
    Index: number;
    Cards: TaskObj[];
}

export type Board = {
    Id: string;
    UpdateHashCode: number;
    Title: string;
    CreatedDateUTC: Date;
    CreatedBy: User;
    Columns: Column[];
    BoardUsers: User[];
    PermissionLevel: "Viewer" | "User" | "Owner";
}
