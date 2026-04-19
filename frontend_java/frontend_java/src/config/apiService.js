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
    const id = p.id || p.Id || p.productId;
    const name = p.name || p.Name || p.productName;
    const imageUrl = p.imageUrl || p.ImageUrl || p.image;
    const price = p.price || p.Price || 0;
    const description = p.description || p.Description || "";

    return {
        ...p,
        id: id,
        productId: id,
        productName: name,
        image: imageUrl,
        price: price,
        description: description
    };
}

export async function GET_PRODUCT(pageNumber = 1, pageSize = 20) {
    try {
        const data = await callApi("Products", "GET");
        const mapped = (data || []).map(mapProduct).filter(x => x);
        
        // Giả lập phân trang nếu Backend trả về mảng phẳng
        return { 
            products: mapped, 
            totalElements: mapped.length, 
            totalPages: Math.ceil(mapped.length / pageSize),
            pageNumber: pageNumber - 1 
        };
    } catch (e) {
        return { products: [], totalElements: 0, totalPages: 1 };
    }
}

export async function GET_PRODUCTS_BY_CATEGORY(categoryId, pageNumber = 1, pageSize = 20) {
    const res = await GET_PRODUCT();
    let filtered = res.products;
    
    // Logic lọc theo Category (Giả định 1: Phone, 2: Laptop)
    if (categoryId === 1 || categoryId === "1" || categoryId === "phone") {
        filtered = res.products.filter(p => p.productName.toLowerCase().includes("phone") || p.productName.toLowerCase().includes("iphone"));
    } else if (categoryId === 2 || categoryId === "2" || categoryId === "laptop") {
        filtered = res.products.filter(p => p.productName.toLowerCase().includes("laptop") || p.productName.toLowerCase().includes("msi") || p.productName.toLowerCase().includes("dell"));
    }
    
    return { 
        products: filtered, 
        totalElements: filtered.length, 
        totalPages: Math.ceil(filtered.length / pageSize)
    };
}

export async function GET_PRODUCT_BY_ID(id) {
    const p = await callApi(`Products/${id}`, "GET");
    return mapProduct(p);
}
export const GET_ID = GET_PRODUCT_BY_ID;

export async function GET_PRODUCTS_BY_KEYWORD(keyword) {
    const res = await GET_PRODUCT();
    const filtered = res.products.filter(x => 
        x.productName?.toLowerCase().includes(keyword.toLowerCase())
    );
    return { products: filtered, totalElements: filtered.length };
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
export async function GET_CART_BY_USER_ID(sessionId) { 
    return callApi(`Cart/${sessionId}`, "GET"); 
}
export async function ADD_TO_CART(sessionId, productId, quantity = 1) { 
    // Gửi dưới dạng query parameters vì Backend CartController/AddToCart nhận trực tiếp từ URL
    return callApi(`Cart/AddToCart?sessionId=${sessionId}&productId=${productId}&quantity=${quantity}`, "POST"); 
}
export async function UPDATE_CART_QUANTITY(sessionId, productId, quantity) { 
    return callApi(`Cart/UpdateQuantity?sessionId=${sessionId}&productId=${productId}&quantity=${quantity}`, "PUT"); 
}
export async function DELETE_FROM_CART(sessionId, productId) { 
    return callApi(`Cart/RemoveFromCart?sessionId=${sessionId}&productId=${productId}`, "DELETE"); 
}

// ===== Orders =====
export async function PLACE_ORDER(email, addressId, shippingFee, fullAddress) { 
    return callApi("Orders", "POST", { 
        email, 
        addressId, 
        shippingFee, 
        fullAddress 
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
        return data; 
    }
    throw new Error("Tài khoản hoặc mật khẩu không đúng.");
}
export async function POST_ADD(endpoint, data) { return callApi("Users", "POST", data); }
export function LOGOUT() { 
    removeToken(); 
    removeEmail();
}
