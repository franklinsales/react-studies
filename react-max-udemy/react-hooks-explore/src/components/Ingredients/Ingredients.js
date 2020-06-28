import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http'

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

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear }= useHttp();
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
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra})
    }else if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      dispatch({type: 'ADD', ingredient: { id: data.name, ...reqExtra} })
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients)
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      `${process.env.REACT_APP_FIREBASE_URL}/ingredients.json`,
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
    // dispatchHttp({type: 'SEND'})
    // fetch(process.env.REACT_APP_FIREBASE_URL+'/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'})
    //   return response.json()      
    // }).then( responseData => {
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients,
    //   //   { id: responseData.name, ...ingredient }
    //   // ])
    //   dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ingredient} })
    // })
  }, [sendRequest])

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`${process.env.REACT_APP_FIREBASE_URL}/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    )
  }, [sendRequest]);

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

      {error && <ErrorModal onClose={clear}>{error}</ErrorModal> }

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
