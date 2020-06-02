import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  /* We already get list of ingredients em Search component, so we don't need no more this useEffect() hook here*/
  // useEffect(() => {
  //   fetch(process.env.REACT_APP_FIREBASE_URL+'/ingredients.json')
  //   .then(response => response.json())
  //   .then(responseData => {
  //     const loadedIngredients = []
  //     for (const key in responseData){
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       })
  //     }
  //     setUserIngredients(loadedIngredients)
  //   })
  // }, [])

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients)
  }, [userIngredients])

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  }, [])

  const addIngredientHandler = ingredient => {
    fetch(process.env.REACT_APP_FIREBASE_URL+'/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json()      
    }).then( responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    });
  }

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onLoadIngredients={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
        <IngredientsList 
          ingredients={userIngredients}
          onRemoveItem ={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
