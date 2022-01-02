import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [didSubmit, setDidSubmit] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const checkoutHandler = () => {
    setIsCheckingOut(true);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalAction = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={checkoutHandler}>
          Order
        </button>
      )}
    </div>
  );

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://react-form-api-default-rtdb.firebaseio.com/orders.json",
        {
          method: "POST",
          body: JSON.stringify({
            user: userData,
            orderedItem: cartCtx.items,
          }),
        }
      );

      if (!res.ok) throw new Error("Something went wrong!");

      setIsSubmitting(false);

      setDidSubmit(true);

      cartCtx.clearCart();
    } catch (err) {
      console.error(err);
    }
  };

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckingOut && (
        <Checkout onClose={props.onClose} onSubmihOrder={submitOrderHandler} />
      )}
      {!isCheckingOut && modalAction}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data....</p>;

  const didSubmitOrderContent = (
    <React.Fragment>
      <p>Successfully sent the order...</p>

      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitOrderContent}
    </Modal>
  );
};

export default Cart;
