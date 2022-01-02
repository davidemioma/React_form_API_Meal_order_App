import classes from "./Checkout.module.css";
import { useRef, useState } from "react";

const isEmpyty = (value) => value.trim() === "";

const haveFiveChars = (value) => value.length === 5;

function Checkout(props) {
  const [formValidity, setFormValidity] = useState({
    name: true,
    street: true,
    postal: true,
    city: true,
  });

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalInputRef = useRef();
  const cityInputRef = useRef();

  const confirmHandler = (e) => {
    e.preventDefault();

    const nameEntered = nameInputRef.current.value;
    const streetEntered = streetInputRef.current.value;
    const postalEntered = postalInputRef.current.value;
    const cityEntered = cityInputRef.current.value;

    const nameIsValid = !isEmpyty(nameEntered);
    const streetIsValid = !isEmpyty(streetEntered);
    const postalIsValid = !isEmpyty(postalEntered);
    const cityIsValid = haveFiveChars(cityEntered);

    setFormValidity({
      name: nameIsValid,
      street: streetIsValid,
      postal: postalIsValid,
      city: cityIsValid,
    });

    const formIsValid =
      nameIsValid && streetIsValid && postalIsValid && cityIsValid;

    if (!formIsValid) {
      return;
    }

    props.onSubmihOrder({
      name: nameEntered,
      street: streetEntered,
      postalCode: postalEntered,
      city: cityEntered,
    });
  };

  const nameClasses = `${classes.control} ${
    formValidity.name ? "" : classes.invalid
  }`;

  const streetClasses = `${classes.control} ${
    formValidity.street ? "" : classes.invalid
  }`;

  const postalClasses = `${classes.control} ${
    formValidity.postal ? "" : classes.invalid
  }`;

  const cityClasses = `${classes.control} ${
    formValidity.city ? "" : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameClasses}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" ref={nameInputRef} />
        {!formValidity.name && <p>Please enter a valid name!</p>}
      </div>

      <div className={streetClasses}>
        <label htmlFor="street">Street</label>
        <input id="street" type="text" ref={streetInputRef} />
        {!formValidity.street && <p>Please enter a valid street!</p>}
      </div>

      <div className={postalClasses}>
        <label htmlFor="postal">Postal code</label>
        <input id="postal" type="text" ref={postalInputRef} />
        {!formValidity.postal && (
          <p>Please enter a valid postal code five characters long!</p>
        )}
      </div>

      <div className={cityClasses}>
        <label htmlFor="city">City</label>
        <input id="city" type="text" ref={cityInputRef} />
        {!formValidity.city && <p>Please enter a valid city!</p>}
      </div>

      <div className={classes.actions}>
        <button className={classes.submit}>Confirm</button>
        <button type="button" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Checkout;
