import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientsList from './IngredientList'
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

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

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientsList 
          ingredients={userIngredients}
          onRemoveItem ={() => {}}
        />
      </section>
    </div>
  );
}

export default Ingredients;
