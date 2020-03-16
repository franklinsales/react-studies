import React, { Component } from 'react'

import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

class Orders extends Component{
    state = {
        orders: [],
        loading: true
    }

    componentDidMount(){
        axios.get('/orders.json')
        .then(res => {
            const fetchedOders = []
            for (let key in res.data){
                fetchedOders.push({
                    ...res.data[key],
                    id: key
                })
            }

            this.setState({loading:false, orders:fetchedOders})
        })
        .catch(err => {
            this.setState({loading: false})
        })
    }


    render(){
        return (
            <div>
                {console.log(this.state.orders)}
                {this.state.orders.map(order => (
                                        
                    <Order 
                        key={order.id}
                        ingredients = {order.ingredients}
                        price = {order.price}

                    />
                ))}
            </div>
        )
    }
}


export default withErrorHandler(Orders, axios)