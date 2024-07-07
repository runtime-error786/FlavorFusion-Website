const initialState = []; // Initial state is an empty array
let Rol = (state = "", action) => {
    if (action.type === "Role") {
        console.log("red",action.payload)
        return state = action.payload;
    }
    else {
        return state;
    }
}


export {Rol}