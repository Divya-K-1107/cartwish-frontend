import React, { useState, useEffect } from "react";

import config from "../../config.json";
import useData from "../../hooks/useData.js";
import "./ProductsSidebar.css";
import LinkWithIcon from "../Navbar/LinkWithIcon";
//import apiClient from "../../utils/api-client.js";

const ProductsSidebar = () => {
  const { data: category, error } = useData("/category"); //rename data to categories

  // const [category,setCategory]=useState([])
  // const [error, setError] = useState("");
  // useEffect(() => {
  //     apiClient
  //       .get("/category")
  //       .then(res=>setCategory(res.data))
  //       .catch(err=>setError(err.message))
  // }, []);

  return (
    <aside className="products_sidebar">
      <h2>Category</h2>

      <div className="category_links">
        {error && <em className="form_error">{error}</em>}
        {category &&
          category.map((category) => (
            <LinkWithIcon
              key={category._id}
              title={category.name}
              link={`/products?category=${category.name}`} //category in query string
              emoji={`${config.backendURL}/category/${category.image}`}
              sidebar={true}
            />
          ))}
      </div>
    </aside>
  );
};

export default ProductsSidebar;
