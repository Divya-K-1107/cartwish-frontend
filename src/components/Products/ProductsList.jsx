import React, { useEffect, useState } from "react";

import useData from "../../hooks/useData.js";
import "./ProductsList.css";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Common/Pagination.jsx";
//import apiClient from "../../utils/api-client.js";

const ProductsList = () => {
  const [sortBy, setSortBy] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useSearchParams();

  const category = search.get("category");
  const searchQuery = search.get("search"); //to implement search functionality

  const { data, error, isLoading } = useData(
    "/products",
    {
      params: {
        search: searchQuery,
        category, //name and value same
        page, //name and value same
        //perPage: 10, //can specify number of products per page - default is 8
      },
    },
    [searchQuery, category, page]
  );

  const products = data?.products;

  // const [products,setProducts]=useState([])
  // const [error, setError] = useState("");
  // useEffect(() => {
  //     apiClient
  //       .get("/products")
  //       .then(res=>setProducts(res.data.products))
  //       .catch(err=>setError(err.message))
  // }, []);

  //below function - when category/search query string parameter changes - set page to 1
  //for example one category we're in 2nd page, if we change category should see 1st page
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      //console.log("Scroll top " + scrollTop); //dist from top of page to current view
      //console.log("Client height " + clientHeight); //height of web browser window or visible height of web browser
      //console.log("Scroll height " + scrollHeight); //total height of entire web page including the parts that are not currently visible
      //at bottom of page, scrollTop + clientHeight = scrollHeight
      if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        !isLoading &&
        data &&
        page < data.totalPages
      ) {
        console.log("You have reached the bottom of the page!");
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);

    //CleanUp function
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, isLoading]);

  useEffect(() => {
    if (data && data.products) {
      const products = [...data.products];

      if (sortBy === "price desc") {
        setSortedProducts(products.sort((a, b) => b.price - a.price));
      } else if (sortBy === "price asc") {
        setSortedProducts(products.sort((a, b) => a.price - b.price));
      } else if (sortBy === "rate desc") {
        setSortedProducts(
          products.sort((a, b) => b.reviews.rate - a.reviews.rate)
        );
      } else if (sortBy === "rate asc") {
        setSortedProducts(
          products.sort((a, b) => a.reviews.rate - b.reviews.rate)
        );
      } else {
        setSortedProducts(products);
      }
    }
  }, [sortBy, data]);

  return (
    <section className="products_list_section">
      <header className="align_center products_list_header">
        <h2>Products</h2>
        <select
          name="sort"
          id=""
          className="products_sorting"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Relevance</option>
          <option value="price desc">Price: HIGH to LOW</option>
          <option value="price asc">Price: LOW to HIGH</option>
          <option value="rate desc">Rate: HIGH to LOW</option>
          <option value="rate asc">Rate: LOW to HIGH</option>
        </select>
      </header>

      <div className="products_list">
        {error && <em className="form_error">{error}</em>}
        {products &&
          sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        {isLoading &&
          skeletons.map((skeleton) => <ProductCardSkeleton key={skeleton} />)}
      </div>

      {/* Pagination Code
      {data && <Pagination
          totalPosts={data.totalProducts}
          postsPerPage={8}
          onClick={handlePageChange}
          currentPage={page}
      />}
      */}
    </section>
  );
};

export default ProductsList;
