const initialState = {
    role: "",
    nextPage: 1,
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

let Price = (state = "", action) => {
  if (action.type === "Price") {
      console.log(action.payload)
      return action.payload;
  }
  return state;
}


let Cart_length = (state = 0, action) => {
  if (action.type === "cart_count") {
      console.log(action.payload)
      return action.payload;
  }
  return state;
}

let checkbtn = (state = false, action) => {
  if (action.type === "IsOutOfStock") {
      console.log(action.payload)
      return action.payload;
  }
  return state;
}

export { Rol, Next, Totalpage, SearchUser, SortUser ,Record,Price,checkbtn,Cart_length};
  