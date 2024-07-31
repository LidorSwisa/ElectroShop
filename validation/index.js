const z = require("zod");

const UserLoginScheme = z.object({
  email: z.string("Email address missing").email("Email address must be valid email.."),
  password: z.string("Password missing"),
});

const regexPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserRegisterScheme = z.object({
  email: z.string("Email address missing").email("Email address must be valid email.."),
  birthDay: z.string("Birthday must be provided"),
  name: z.string("Full name must be provided"),
  password: z
    .string("Password missing")
    .regex(regexPass, "Password must contain 1 upper case letter, 1 number and 1 symbol"),
});

const CartUpdateScheme = z.object({
  quantity: z.number("Quantity must be a numeric value"),
  itemId: z.string("Item must be selected for cart update operation"),
});

const OrderSubmissionScheme = z.object({
  user: z.string("User must be provided"),
  cart: z.string("Cart must be provided"),
  address: z.object({
    country: z.string("Country must be provided"),
    city: z.string("City must be provided"),
    street: z.string("Street must be provided"),
    houseNumber: z.string("House number must be provided"),
    zipCode: z.string("Zip code must be provided"),
  }),
  email: z.string("Email address must be provided"),
  phone: z.string("Phone number must be provided"),
  name: z.string("Full name must be provided"),
  cardInfo: z.object({
    cardHolderName: z.string("Card holder name must be provided"),
    expiryDate: z.string("Expiry date must be provided"),
    fourDigits: z.string("Four digits must be provided"),
    CVV: z.string("CVV must be provided"),
  }),
});

const CreateCategoryScheme = z.object({
  name: z.string("Category name must be provided"),
});

const CreateProductScheme = z.object({
  name: z.string("Product name must be provided"),
  description: z.string("Product description must be provided"),
  brand: z.string("Product brand must be provided"),
  category: z.string("Product category must be provided"),
  price: z.object({
    amount: z.number("Product price must be provided"),
    currency: z.string("Product currency must be provided"),
    discount: z.number("Product discount must be provided"),
  }),
  availability: z.string("Product availability must be provided"),
  warranty: z.string("Product warranty must be provided"),
  tags: z.array(z.string("Product tags must be provided")),
  images: z.array(
    z.object({
      url: z.string("Product image url must be provided"),
    })
  ),
});

module.exports = {
  UserLoginScheme,
  UserRegisterScheme,
  OrderSubmissionScheme,
  CartUpdateScheme,
  CreateCategoryScheme,
  CreateProductScheme,
};
