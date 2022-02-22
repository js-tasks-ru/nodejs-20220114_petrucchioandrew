const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const { product: productId, phone, address } = ctx.request.body;

  const product = await Product.findOne({ id: productId });
  const order = await Order.create({
    user: ctx.user,
    product: productId,
    phone,
    address,
  });

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order.id,
      product,
    },
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id}).populate('product');

  ctx.body = { orders };
};
