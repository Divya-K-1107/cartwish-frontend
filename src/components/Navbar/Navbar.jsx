import React, { useContext, useEffect, useState } from "react";

import "./Navbar.css";
import rocket from "../../assets/rocket.png";
import star from "../../assets/glowing-star.png";
import idButton from "../../assets/id-button.png";
import memo from "../../assets/memo.png";
import order from "../../assets/package.png";
import lock from "../../assets/locked.png";
import LinkWithIcon from "./LinkWithIcon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import CartContext from "../../contexts/CartContext";
import { getSuggestionsAPI } from "../../services/productServices";

const Navbar = () => {
  const user = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const [selectedItem, setSelectedItem] = useState(-1);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/products?search=${search.trim()}`);
    }
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (selectedItem < suggestions.length) {
      //above condition to handle a case where we are at bottom of list and we change our search term
      //then we have to press up multiple times
      //to avoid this specify this condition
      if (e.key === "ArrowDown") {
        setSelectedItem(
          (current) => (current === suggestions.length - 1 ? 0 : current + 1)
          //at bottom of list on pressing down must go to first item
        );
      } else if (e.key === "ArrowUp") {
        setSelectedItem(
          (current) => (current === 0 ? suggestions.length - 1 : current - 1)
          //at top of list on pressing up must go to last item
        );
      } else if (e.key === "Enter" && selectedItem > -1) {
        const suggestion = suggestions[selectedItem];
        navigate(`/products?search=${suggestion.title}`);
        setSearch("");
        setSuggestions([]);
      }
    } else {
      setSelectedItem(-1);
    }
  };

  useEffect(() => {
    const delaySuggestions = setTimeout(() => {
      if (search.trim() !== "") {
        getSuggestionsAPI(search)
          .then((res) => setSuggestions(res.data))
          .catch((err) => console.log(err));
      } else {
        setSuggestions([]);
      }
    }, 300); //debouncing
    //no dependency run on mount and every re-render

    return () => clearTimeout(delaySuggestions); //CleanUp function
  }, [search]);

  console.log(suggestions);

  return (
    <nav className="align_center navbar">
      <div className="align_center">
        <h1 className="navbar_heading">CartWish</h1>
        <form className="align_center navbar_form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="navbar_search"
            placeholder="Search Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" className="search_button">
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="search_result">
              {suggestions.map((suggestion, index) => (
                <li
                  className={
                    selectedItem === index
                      ? "search_suggestion_link active"
                      : "search_suggestion_link"
                  }
                  key={suggestion._id}
                >
                  <Link
                    to={`/products?search=${suggestion.title}`}
                    onClick={() => {
                      setSearch(""); //can set as suggestion.title
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      <div className="align_center navbar_links">
        <LinkWithIcon title="Home" link="/" emoji={rocket} />
        <LinkWithIcon title="Products" link="/products" emoji={star} />
        {!user && (
          <>
            <LinkWithIcon title="SignUp" link="/signup" emoji={memo} />
            <LinkWithIcon title="LogIn" link="/login" emoji={idButton} />
          </>
        )}
        {user && (
          <>
            <LinkWithIcon title="Logout" link="/logout" emoji={lock} />
            <LinkWithIcon title="My Orders" link="/myorders" emoji={order} />
            <NavLink to="/cart" className="align_center">
              Cart <p className="align_center cart_counts">{cart.length}</p>
            </NavLink>
            <label className="user_label">{user.name}</label>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
