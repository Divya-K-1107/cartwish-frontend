import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Routing from "./components/Routing/Routing.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import { getUser, getJwt } from "./services/userServices.js";
import setAuthToken from "./utils/setAuthToken";
import {
  addToCartAPI,
  getCartAPI,
  decreaseProductAPI,
  increaseProductAPI,
  removeFromCartAPI,
} from "./services/cartServices";
import UserContext from "./contexts/UserContext";
import CartContext from "./contexts/CartContext";

setAuthToken(getJwt());
//if we don't call setAuthToken here,
//then we need to add x-auth-token header in each API request which is protected

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const jwtUser = getUser();
      //console.log(jwtUser);
      if (Date.now() >= jwtUser.exp * 1000) {
        //exp-expiration time //*1000 - to convert to milliseconds
        localStorage.removeItem("token");
        location.reload();
      } else {
        setUser(jwtUser);
      }
    } catch (error) {
      //do nothing
    }
  }, []);

  //we can define these functions in any component as we have made cart as global state
  const addToCart = useCallback(
    (product, quantity) => {
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        (item) => item.product._id === product._id
      );

      if (productIndex === -1) {
        updatedCart.push({ product: product, quantity: quantity });
      } else {
        updatedCart[productIndex].quantity += quantity;
      }

      setCart(updatedCart);

      addToCartAPI(product._id, quantity)
        .then((res) => {
          toast.success("Product Added Succesfully!");
        })
        .catch((err) => {
          toast.error("Failed to add product!");
          setCart(cart);
        });
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (id) => {
      const oldCart = [...cart];
      const newCart = oldCart.filter((item) => item.product._id !== id);
      setCart(newCart);

      removeFromCartAPI(id).catch((err) => {
        //nothing to do on .then()
        toast.error("Something went wrong!");
        setCart(oldCart);
      });
    },
    [cart]
  );

  const updateCart = useCallback(
    (type, id) => {
      const oldCart = [...cart];
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        (item) => item.product._id === id
      );

      if (type === "increase") {
        updatedCart[productIndex].quantity += 1;
        setCart(updatedCart);

        increaseProductAPI(id).catch((err) => {
          //nothing to do on .then()
          toast.error("Something went wrong!");
          setCart(oldCart);
        });
      }
      if (type === "decrease") {
        updatedCart[productIndex].quantity -= 1;
        setCart(updatedCart);

        decreaseProductAPI(id).catch((err) => {
          //nothing to do on .then()
          toast.error("Something went wrong!");
          setCart(oldCart);
        });
      }
    },
    [cart]
  );

  const getCart = useCallback(() => {
    getCartAPI()
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
      });
  }, [user]);

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);
  //to ensure uniformity of backend cart data and cart local state
  //if called only in CartPage component then cart quantity will display correctly there
  //but in other pages  like Products page when we reload it will reset to 0
  //to prevent this we call useEffect in App component here

  return (
    <UserContext.Provider value={user}>
      <CartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
          updateCart,
          setCart,
        }}
      >
        <div className="app">
          <Navbar />
          <main>
            <ToastContainer position="bottom-right" />
            <Routing />
          </main>
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
