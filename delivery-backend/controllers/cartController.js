import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Hotel from "../models/hotelModel.js";
import Product from "../models/productModel.js";

const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  var totalPrice = 0;
  const cartItems = await Cart.findOne({ user: userId })
    .populate([
      { path: "products.product" },
      {
        path: "products.product",
        populate: {
          path: "hotelName",
        },
      },
    ])
    .sort({ createdAt: -1 });

  if (!cartItems) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cartItems.products.map((b) => {
    var foodPrice = b.price * b.quantity;
    totalPrice = totalPrice + foodPrice;
  });

  res.json({
    totalPrice: totalPrice,
    items: cartItems,
  });
});

const addFoodToCart = asyncHandler(async (req, res) => {
  const { productID, quantity } = req.body;
  const productRes = await Product.findById(productID);
  console.log(productRes);
  if (!productRes) {
    res.status(404);
    throw new Error("Food not found");
  }

  const name = productRes.name;
  const price = productRes.price;

  const userId = req.user._id;

  console.log(userId);

  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    let itemIndex = cart.products.findIndex((p) => p.product == productID);
    console.log(itemIndex);

    if (itemIndex > -1) {
      let productItem = cart.products[itemIndex];
      if (!quantity) {
        productItem.quantity = productItem.quantity + 1;
      } else {
        productItem.quantity = quantity;
      }
      cart.products[itemIndex] = productItem;
    } else {
      cart.products.push({ product: productID, quantity, name, price });
    }
    cart = await cart.save();
    console.log(cart);
    return res.status(201).json(cart);
  } else {
    const newCart = await Cart.create({
      user: userId,
      products: [{ product: productID, quantity, name, price }],
    });

    return res.status(201).json(newCart);
  }
});

const deleteFoodFromCart = asyncHandler(async (req, res) => {
  const { productID } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  let itemIndex = cart.products.findIndex((p) => p.product == productID);
  console.log(itemIndex);

  cart.products.splice(itemIndex, 1);
  cart = await cart.save();
  return res.status(201).json(cart);
});

const updateQuantity = asyncHandler(async (req, res) => {
  const { productID, quantity } = req.body;
  const productRes = await Product.findById(productID);
  console.log(productRes);
  if (!productRes) {
    res.status(404);
    throw new Error("Food not found");
  }

  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  let itemIndex = cart.products.findIndex((p) => p.product == productID);
  if (itemIndex > -1) {
    let productItem = cart.products[itemIndex];
    productItem.quantity = quantity;

    cart.products[itemIndex] = productItem;

    cart = await cart.save();
    console.log(cart);
    return res.status(201).json(cart);
  } else {
    res.status(404);
    throw new Error("Food not found in cart");
  }
});

export { getCartItems, updateQuantity, deleteFoodFromCart, addFoodToCart };
