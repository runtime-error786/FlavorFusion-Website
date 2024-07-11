import { combineReducers } from "redux";
import { Rol, Next, Totalpage, SearchUser, SortUser,Record } from './Reducer';

const Root = combineReducers({
    Rol,
    Next,
    Totalpage,
    SearchUser,
    SortUser,
    Record
  });
  
export { Root };