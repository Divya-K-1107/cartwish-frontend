import apiClient from "../utils/api-client";

export function checkoutAPI() {
  return apiClient.post("/order/checkout");
}

//don't need to pass any data because automatically fetches cart data from backend
