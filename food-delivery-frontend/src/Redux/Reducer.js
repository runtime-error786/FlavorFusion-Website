const initialState = {
    role: "",
    nextPage: 0,
    totalPage: 0,
    searchTerm: "",
    sortUser: false,
    records: []
  };
  
  const Rol = (state = initialState.role, action) => {
    if (action.type === "Role") {
      return action.payload;
    }
    return state;
  };
  
  const Next = (state = initialState.nextPage, action) => {
    if (action.type === "NEXT_PAGE") {
      return action.payload;
    }
    return state;
  };
  
  const Totalpage = (state = initialState.totalPage, action) => {
    if (action.type === "TOTAL_PAGE") {
      return action.payload;
    }
    return state;
  };
  
  const SearchUser = (state = initialState.searchTerm, action) => {
    if (action.type === "SEARCH") {
      return action.payload;
    }
    return state;
  };
  
  const SortUser = (state = initialState.sortUser, action) => {
    if (action.type === "SORT") {
      return action.payload;
    }
    return state;
  };
  
  
  let Record = (state =  initialState.records , action) => {
    if (action.type === "Record") {
        console.log("red",action.payload)
        return state = action.payload;
    }
    else {
        return state;
    }
}

  export { Rol, Next, Totalpage, SearchUser, SortUser ,Record};
  