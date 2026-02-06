function instanceNotFoundError(msg:string){
    const error = new Error( msg );
    error.name = 'Nor Found';
    return error;
}

function instanceUnauthorizedError(msg:string){
    const error = new Error( msg );
    error.name = 'Unauthorized';
    return error;
}

export{
    instanceNotFoundError,
    instanceUnauthorizedError
}