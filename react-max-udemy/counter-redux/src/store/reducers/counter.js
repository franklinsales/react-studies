import * as actionTypes from '../actions/actionsTypes'
import { updateObject } from '../utility'

const initialState = {
    counter: 0
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.INCREMENT:
            return {
                ...state,
                counter: ++state.counter
            }

        case actionTypes.DECREMENT:
            return {
                ...state,
                counter: --state.counter
            }

        case actionTypes.ADD:
            return {
                ...state,
                counter: state.counter + action.val
            }

        case actionTypes.SUBTRACT:
            //Example of utility
            return updateObject(state, {counter: state.counter - action.val})
        
    }

    return state;

}

export default reducer;