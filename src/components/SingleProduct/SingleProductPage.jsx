import React, { useState, useEffect, useContext, memo } from "react";
import { useParams } from "react-router-dom";

import "./SingleProductPage.css";
import config from "../../config.json";
import QuantityInput from "./QuantityInput";
import useData from "../../hooks/useData";
import Loader from "../Common/Loader";
import CartContext from "../../contexts/CartContext";
import UserContext from "../../contexts/UserContext";

const SingleProductPage = () => {
  const { id } = useParams();
  //console.log(params);

  const { addToCart } = useContext(CartContext);

  //bcz addToCart API is protected
  //only if logged in, can add to cart from single products page
  const user = useContext(UserContext);

  const { data: product, error, isLoading } = useData(`/products/${id}`);

  useEffect(() => {
    console.log(product);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <section className="align_center single_product">
      {error && <em>{error}</em>}
      {isLoading && <Loader />}
      {product && (
        <>
          <div className="align_center">
            <div className="single_product_thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`${config.backendURL}/products/${image}`}
                  alt={product.title}
                  className={selectedImage === index ? "selected_image" : ""}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>

            <img
              src={`${config.backendURL}/products/${product.images[selectedImage]}`}
              alt={product.title}
              className="single_product_display"
            />
          </div>

          <div className="single_product_details">
            <h1 className="single_product_title">{product.title}</h1>
            <p className="single_product_description">{product.description}</p>
            <p className="single_product_price">${product.price.toFixed(2)}</p>

            {user && (
              <>
                <h2 className="quantity_title">Quantity:</h2>
                <div className="align_center quantity_input">
                  <QuantityInput
                    quantity={quantity}
                    setQuantity={setQuantity}
                    stock={product.stock}
                  />
                </div>
                <button
                  className="search_button add_cart"
                  onClick={() => {
                    addToCart(product, quantity);
                  }}
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default memo(SingleProductPage);
