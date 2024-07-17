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

export const ShowAllUser2 = (SearchUser, SortUser, currentPage,Category,role) => {
  return async (dispatch) => {
      try {
        if(role=="customer")
          {
          console.log(role)
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
        }
        else if(role=="Guest")
        {
           const url = `http://localhost:8001/products_guest/`;
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
        }
         
         
      } catch (error) {
        toast.error("Your session expire.Please Sign out & Sign in again");
      }
  };
};


export const Showcart = () => {
  return async (dispatch) => {
    try {
      const url = `http://localhost:8001/showcart`;
      const response = await axios.get(url, {
        withCredentials: true
      });
      console.log(response)
      const cartItems = response.data.cartItems;
      const totalPrice = response.data.totalPrice.toString();

      if (cartItems.length === 0) {
        // If cart is empty, dispatch IsOutOfStock with true
        dispatch({
          type: "IsOutOfStock",
          payload: true
        });
      } else {
        // Check if any original quantity is less than the product quantity
        const anyOutOfStock = cartItems.some(item => item.original_qty < item.cart_qty);
        dispatch({
          type: "IsOutOfStock",
          payload: anyOutOfStock
        });
      }

      dispatch({
        type: "Record",
        payload: cartItems
      });

      dispatch({
        type: "Price",
        payload: totalPrice
      });

    } catch (error) {
      toast.error("Your session expired. Please sign out and sign in again.");
    }
  };
};

export const Cart_total_price = (val) => {
  return  (dispatch) => {
    dispatch({
      type: "price",
      payload: val
  });
  };
};

export const Checkout_show = (val) => {
  return  (dispatch) => {
    dispatch({
      type: "IsOutOfStock",
      payload: val
  });
  };
};

export const cart_count = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:2001/cartcount', {
        withCredentials: true
      });
      const cartCount = response.data.cartCount;
      dispatch({
        type: "cart_count",
        payload: cartCount
      });
    } catch (error) {
      toast.error("Your session expire.Please Sign out & Sign in again");
    }
  };
};