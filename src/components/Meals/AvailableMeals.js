import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useEffect, useState } from "react";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [httpError, setHttpError] = useState();

  const fetchMeals = async function () {
    try {
      const res = await fetch(
        "https://react-form-api-default-rtdb.firebaseio.com/meals.json"
      );

      if (!res.ok) throw new Error("Something went wrong!");

      const data = await res.json();

      const results = [];

      for (const key in data) {
        results.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price,
        });
      }

      setMeals(results);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setHttpError(err.message);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  if (isLoading) {
    return (
      <section className={classes.meals_loading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.meals_error}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsData = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsData}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
