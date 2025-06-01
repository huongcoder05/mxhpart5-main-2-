import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CartPage from "../app/giohang/page";
import MarketplacePage from "../app/buonban/page";

// Mock localStorage
class LocalStorageMock {
  store: Record<string, string>;
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}
Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

// Helper to add product to cart in localStorage
const addProductToCart = (product) => {
  const cartStr = window.localStorage.getItem("cart");
  let cart = cartStr ? JSON.parse(cartStr) : [];
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  window.localStorage.setItem("cart", JSON.stringify(cart));
};

describe("Cart and Marketplace integration tests", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("Cart page shows empty message when no products", () => {
    render(<CartPage />);
    expect(screen.getByText(/Giỏ hàng của bạn đang trống/i)).toBeInTheDocument();
  });

  test("Adding product to cart updates localStorage and cart page", () => {
    const product = {
      id: 1,
      title: "Test Product",
      price: 1000,
      imageUrl: "test.jpg",
    };

    act(() => {
      addProductToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByText("1.000 đ")).toBeInTheDocument();
  });

  test("Adding multiple different products updates localStorage and UI correctly", () => {
    const product1 = {
      id: 10,
      title: "Product One",
      price: 500,
      imageUrl: "one.jpg",
    };
    const product2 = {
      id: 11,
      title: "Product Two",
      price: 1500,
      imageUrl: "two.jpg",
    };

    act(() => {
      addProductToCart(product1);
      addProductToCart(product2);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    expect(screen.getByText(/Product One/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Two/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();

    // Check localStorage content
    const cartStr = window.localStorage.getItem("cart");
    const cart = cartStr ? JSON.parse(cartStr) : [];
    expect(cart.length).toBe(2);
    expect(cart.find(item => item.id === 10)?.quantity).toBe(1);
    expect(cart.find(item => item.id === 11)?.quantity).toBe(1);
  });

  test("Adding the same product multiple times increments quantity", () => {
    const product = {
      id: 20,
      title: "Repeated Product",
      price: 800,
      imageUrl: "repeat.jpg",
    };

    act(() => {
      addProductToCart(product);
      addProductToCart(product);
      addProductToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    expect(screen.getByText(/Repeated Product/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();

    // Check localStorage content
    const cartStr = window.localStorage.getItem("cart");
    const cart = cartStr ? JSON.parse(cartStr) : [];
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(3);
  });

  test("Changing quantity updates total price", () => {
    const product = {
      id: 2,
      title: "Another Product",
      price: 2000,
      imageUrl: "another.jpg",
    };

    act(() => {
      addProductToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    const quantityInput = screen.getByDisplayValue("1");
    fireEvent.change(quantityInput, { target: { value: "3" } });

    expect(screen.getByText("6.000 đ")).toBeInTheDocument(); // 2000 * 3
  });

  test("Deleting product removes it from cart", () => {
    const product = {
      id: 3,
      title: "Delete Product",
      price: 1500,
      imageUrl: "delete.jpg",
    };

    act(() => {
      addProductToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    const deleteButton = screen.getByText("Xóa");
    window.confirm = jest.fn(() => true); // mock confirm dialog to always confirm
    fireEvent.click(deleteButton);

    expect(screen.queryByText(/Delete Product/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Giỏ hàng của bạn đang trống/i)).toBeInTheDocument();
  });

  test("Deleting one product when multiple products exist updates UI and localStorage", () => {
    const product1 = {
      id: 100,
      title: "Product 100",
      price: 1000,
      imageUrl: "p100.jpg",
    };
    const product2 = {
      id: 101,
      title: "Product 101",
      price: 2000,
      imageUrl: "p101.jpg",
    };

    act(() => {
      addProductToCart(product1);
      addProductToCart(product2);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    expect(screen.getByText(/Product 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Product 101/i)).toBeInTheDocument();

    const deleteButtons = screen.getAllByText("Xóa");
    window.confirm = jest.fn(() => true);
    fireEvent.click(deleteButtons[0]); // Delete first product

    expect(screen.queryByText(/Product 100/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Product 101/i)).toBeInTheDocument();

    // Check localStorage content
    const cartStr = window.localStorage.getItem("cart");
    const cart = cartStr ? JSON.parse(cartStr) : [];
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe(101);
  });

  test("Canceling delete does not remove product", () => {
    const product = {
      id: 200,
      title: "Product 200",
      price: 500,
      imageUrl: "p200.jpg",
    };

    act(() => {
      addProductToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    const deleteButton = screen.getByText("Xóa");
    window.confirm = jest.fn(() => false); // Cancel delete
    fireEvent.click(deleteButton);

    expect(screen.getByText(/Product 200/i)).toBeInTheDocument();

    // Check localStorage content
    const cartStr = window.localStorage.getItem("cart");
    const cart = cartStr ? JSON.parse(cartStr) : [];
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe(200);
  });

  test("Checkout button click shows alert", () => {
    const product = {
      id: 4,
      title: "Checkout Product",
      price: 3000,
      imageUrl: "checkout.jpg",
    };

    act(() => {
      addProductToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
    });

    render(<CartPage />);
    const checkoutButton = screen.getByText("ĐẶT HÀNG");
    window.alert = jest.fn();
    fireEvent.click(checkoutButton);
    expect(window.alert).toHaveBeenCalledWith("Chức năng đặt hàng chưa được triển khai.");
  });
});
