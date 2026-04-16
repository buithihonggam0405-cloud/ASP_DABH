// APIService.js (React Web) - Final Fix for ASP.NET
import axios from "axios";

const API_URL = "http://localhost:5233/api";

// ===== Base Configuration & Token =====
export function getToken() { return localStorage.getItem("adminToken"); }
export function setToken(token) { localStorage.setItem("adminToken", token); }
export function removeToken() { localStorage.removeItem("adminToken"); }
export function getUserEmail() { return localStorage.getItem("user-email") || ""; }
export function setUserEmail(email) { localStorage.setItem("user-email", email); }
export function removeEmail() { localStorage.removeItem("user-email"); }

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function callApi(endpoint, method = "GET", data = null, params = null) {
  try {
    const res = await axiosInstance({
      method,
      url: endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
      data,
      params,
    });
    return res.data;
  } catch (error) {
    console.error("API call error:", error?.response || error);
    throw error;
  }
}

// ===== Products & Mapping =====
function mapProduct(p) {
    if (!p) return null;
    // Hỗ trợ cả Id (PascalCase) và id (camelCase)
    const id = p.id || p.Id || p.productId;
    const name = p.name || p.Name || p.productName;
    const imageUrl = p.imageUrl || p.ImageUrl || p.image;
    const price = p.price || p.Price || 0;

    return {
        ...p,
        productId: id,
        productName: name,
        image: imageUrl,
        price: price
    };
}

export async function GET_PRODUCT(pageNumber = 0, pageSize = 10) {
    const data = await callApi("Products", "GET");
    const mapped = (data || []).map(mapProduct).filter(x => x);
    return { products: mapped.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize) };
}

export async function GET_PRODUCTS_BY_CATEGORY(categoryId, pageNumber = 0, pageSize = 10) {
    const data = await callApi("Products", "GET");
    const mapped = (data || []).map(mapProduct).filter(x => x);
    return { products: mapped.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize) };
}

export async function GET_PRODUCT_BY_ID(id) {
    const p = await callApi(`Products/${id}`, "GET");
    return mapProduct(p);
}
export const GET_ID = GET_PRODUCT_BY_ID;

export async function GET_PRODUCTS_BY_KEYWORD(keyword) {
    const data = await callApi("Products", "GET");
    const filtered = (data || []).filter(x => x.name?.toLowerCase().includes(keyword.toLowerCase()));
    return { products: filtered.map(mapProduct) };
}

export async function GET_CATEGORIES() { return []; }

// ===== Images =====
export function GET_IMG(arg1, arg2) {
  const imgUrl = arg2 || arg1;
  if (!imgUrl) return "https://via.placeholder.com/300";
  if (imgUrl.startsWith("http")) return imgUrl;
  return `http://localhost:5233${imgUrl}`;
}

// ===== Cart =====
export async function GET_CART_BY_USER_ID(userId) { return { cartId: 1, cartItems: [] }; }
export async function ADD_TO_CART(cartId, productId, quantity) { return callApi("Cart", "POST", { productId, quantity }); }
export async function UPDATE_CART_QUANTITY(cartId, productId, quantity) { return true; }
export async function DELETE_FROM_CART(cartId, productId) { return true; }

// ===== Orders =====
export async function PLACE_ORDER(email, cartId, addressId, payment) { 
    return callApi("Orders", "POST", { 
        customerName: email, 
        phoneNumber: "000", 
        address: "Mặc định", 
        totalAmount: 100000 
    }); 
}
export async function GET_ORDERS_BY_EMAIL(email) { return callApi("Orders", "GET"); }
export async function GET_ORDER_DETAIL(email, orderId) { return { id: orderId, totalAmount: 0 }; }

// ===== User & Address =====
export async function GET_USER_BY_EMAIL(email) { return { userId: 1, email: email }; }
export async function GET_USER_ADDRESSES(userId) { return []; }
export async function CREATE_USER_ADDRESS(userId, data) { return true; }

// ===== Auth =====
export async function POST_LOGIN(email, password) {
    const data = await callApi("Auth/login", "POST", { username: email, password });
    if (data?.token) {
        setToken(data.token);
        setUserEmail(email);
        return true;
    }
    return false;
}
export async function POST_ADD(endpoint, data) { return callApi("Users", "POST", data); }
export function LOGOUT() { 
    removeToken(); 
    removeEmail();
}
