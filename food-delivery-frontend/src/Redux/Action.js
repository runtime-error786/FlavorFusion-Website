import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Auth = () => {
  return async (dispatch) => {
    try {
      console.log("hi i am run")
      const response = await axios.get("http://localhost:8001/auth", { withCredentials: true });
      console.log("reduu",response.data.role)
      if(response.data.role=="customer" || response.data.role=="admin")
      {
        dispatch({
          type: "Role",
          payload: response.data.role
        });
        console.log("in if",response);
      }
      else{
        dispatch({
          type: "Role",
          payload:"Guest"
        });
      }
    } catch (error) {
      console.log("err")
      dispatch({
        type: "Role",
        payload:"Guest"
      });
    }
  };
};

export const Auth_direct = (c) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: "Role",
        payload:c
      });
      console.log("done auth1")
    } catch (error) {
      console.error('Error:', error);
     
    }
  };
};


export const NextPage = (page) => ({
  type: 'NEXT_PAGE',
  payload: page
});

export const Total = (total) => ({
  type: 'TOTAL_PAGE',
  payload: total
});

export const SearchAction = (term) => ({
  type: 'SEARCH',
  payload: term
});

export const SortAction = (sort) => ({
  type: 'SORT',
  payload: sort
});

export const ShowAllUser = (SearchUser, SortUser, currentPage) => {
  return async (dispatch) => {
      try {
          const url = `http://localhost:8001/users/admins/`;
          const response = await axios.get(url, {
              params: {
                  search: SearchUser,
                  sort: SortUser,
                  page: currentPage,
              },
              withCredentials: true
          });
          console.log(response)
          // const { data, totalPages } = response.data; 
          const data = response.data.data; 
          const totalPages = response.data.total_pages;
          dispatch({
              type: "Record",
              payload: data 
          });

          dispatch({
              type: "TOTAL_PAGE",
              payload: totalPages 
          });
      } catch (error) {
        toast.error("Your session expire.Please Sign out & Sign in again");
      }
  };
};

export const ShowAllUser1 = (SearchUser, SortUser, currentPage) => {
  return async (dispatch) => {
      try {
          const url = `http://localhost:8001/products/`;
          const response = await axios.get(url, {
              params: {
                  search: SearchUser,
                  sort: SortUser,
                  page: currentPage,
              },
              withCredentials: true
          });
          console.log(response)
          // const { data, totalPages } = response.data; 
          const data = response.data.results.data; 
          const totalPages = response.data.results.total_pages;
          dispatch({
              type: "Record",
              payload: data 
          });

          dispatch({
              type: "TOTAL_PAGE",
              payload: totalPages 
          });
      } catch (error) {
        toast.error("Your session expire.Please Sign out & Sign in again");
      }
  };
};

export const ShowAllUser2 = (SearchUser, SortUser, currentPage,Category) => {
  return async (dispatch) => {
      try {
          const url = `http://localhost:8001/products_get/`;
          const response = await axios.get(url, {
              params: {
                  search: SearchUser,
                  sort: SortUser,
                  page: currentPage,
                  Category:Category
              },
              withCredentials: true
          });
          console.log(response)
          // const { data, totalPages } = response.data; 
          const data = response.data.results.data; 
          const totalPages = response.data.results.total_pages;
          dispatch({
              type: "Record",
              payload: data 
          });

          dispatch({
              type: "TOTAL_PAGE",
              payload: totalPages 
          });
      } catch (error) {
        toast.error("Your session expire.Please Sign out & Sign in again");
      }
  };
};