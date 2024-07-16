import { combineReducers } from "redux";
import { Rol, Next, Totalpage, SearchUser, SortUser,Record,Price,checkbtn,Cart_length } from './Reducer';

const Root = combineReducers({
    Rol,
    Next,
    Totalpage,
    SearchUser,
    SortUser,
    Record,
    Price,
    checkbtn,
    Cart_length
  });
  
export { Root };