import * as SecureStore from "expo-secure-store";

// رابط السيرفر، مأخوذ من ملف .env
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const TOKEN_KEY = "auth_token";

/**
 * حفظ التوكين بأمان على الجهاز (مشفّر بواسطة expo-secure-store)
 */
export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * جلب التوكين المحفوظ (أو null لو المستخدم غير مسجل دخول)
 */
export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * حذف التوكين (تسجيل خروج)
 */
export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * دالة مركزية لكل طلبات الـ API
 * تضيف الـ Authorization Header تلقائياً لو فيه توكين محفوظ
 */
async function request(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // نرمي رسالة الخطأ القادمة من السيرفر نفسه عشان نعرضها للمستخدم
    throw new Error(data.error || "حصل خطأ غير متوقع");
  }

  return data;
}

/* =========================================================
   Authentication
   ========================================================= */

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await saveToken(data.token);
  return data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await saveToken(data.token);
  return data;
}

/* =========================================================
   Products & Categories
   ========================================================= */

export async function getCategories() {
  return request("/categories");
}

export async function getProducts(categoryId?: number) {
  const query = categoryId ? `?categoryId=${categoryId}` : "";
  return request(`/products${query}`);
}

export async function getProductBySlug(slug: string) {
  return request(`/products/${slug}`);
}

/* =========================================================
   Addresses & Orders
   ========================================================= */

export async function createAddress(payload: {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  label?: string;
  area?: string;
  buildingDetails?: string;
}) {
  return request("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createOrder(payload: {
  addressId: number;
  items: { productId: number; quantity: number }[];
  promoCode?: string;
}) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrders() {
  return request("/orders");
}

/* =========================================================
   User Profile
   ========================================================= */

export async function getMe() {
  return request("/auth/me");
}

export async function logout() {
  await removeToken();
}

/* =========================================================
   Wishlist
   ========================================================= */

export async function getWishlist() {
  return request("/wishlist");
}

export async function addToWishlist(productId: number) {
  return request("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: number) {
  return request(`/wishlist/${productId}`, {
    method: "DELETE",
  });
}
