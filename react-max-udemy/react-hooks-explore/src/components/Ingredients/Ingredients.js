import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET': 
      return action.ingredients;

    case 'ADD':
      return [...currentIngredients, action.ingredient]
    
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)

    default:
      throw new Error("Should not get there!")
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null}
    case 'RESPONSE':
      return { ...curHttpState, loading: false}
    case 'ERROR':
      return { loading: false, error: action.errorMessage}
    case 'CLEAR':
      return { ...curHttpState, error: null}
    default:
      throw new Error("Should not get there!")
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
  //const [ userIngredients, setUserIngredients ] = useState([]);
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()

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
  }, [userIngredients])

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients)
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({type: 'SEND'})
    fetch(process.env.REACT_APP_FIREBASE_URL+'/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      return response.json()      
    }).then( responseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ])
      dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ingredient} })
    })
  }, [])

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({type: 'SEND'})
    fetch(`${process.env.REACT_APP_FIREBASE_URL}/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'})
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({type: 'DELETE', id: ingredientId})
    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'})
    }) 
  }, []);

  const clearError = useCallback(() => {
    dispatch({type: 'CLEAR'})
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientsList 
          ingredients={userIngredients}
          onRemoveItem ={removeIngredientHandler}
        />
    )
  }, [userIngredients, removeIngredientHandler])
  

  return (
    <div className="App">

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal> }

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
