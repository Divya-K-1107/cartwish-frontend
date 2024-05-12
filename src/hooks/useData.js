import React, { useEffect, useState } from "react";
import apiClient from "../utils/api-client.js";

const useData = (endpoint, customConfig, deps) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      setIsLoading(true);
      apiClient
        .get(endpoint, customConfig)
        .then((res) => {
          //console.log(res.data)
          if (
            endpoint === "/products" &&
            data &&
            data.products &&
            customConfig.params.page !== 1
          ) {
            setData((prev) => ({
              ...prev,
              products: [...prev.products, ...res.data.products],
            })); //to return object wrap around ()
          } else {
            setData(res.data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          //console.log(err)
          setError(err.message);
          setIsLoading(false);
        });
    },
    deps ? deps : []
  );

  return { data, error, isLoading };
};

export default useData;
