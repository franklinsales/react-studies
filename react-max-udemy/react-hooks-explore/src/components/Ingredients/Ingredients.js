import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

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
    setIsLoading(true)
    fetch(process.env.REACT_APP_FIREBASE_URL+'/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false)
      return response.json()      
    }).then( responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    });
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true)
    fetch(`${process.env.REACT_APP_FIREBASE_URL}/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false)
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      setError(error.message)
    }) 
  };

  const clearError = () => {
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className="App">

      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal> }

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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
