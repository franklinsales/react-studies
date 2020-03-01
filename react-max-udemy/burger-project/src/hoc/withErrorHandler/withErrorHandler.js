import React, { Component } from 'react'

import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Aux/Aux'

const withErrorHandler = (WrappedComponent, axios) => {

    return class extends Component {
        constructor() {
            super()
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({ error: null })
                return req;
            })
            this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error })
            })
        }

        state = {
            error: null
        }

        componentWillUnmount () {
            console.log('Will Unmount', this.reqInterceptor, this.responseInterceptor)
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.request.eject(this.responseInterceptor)
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null })
        }

        render () {
            return (
                <Aux>
                    <Modal show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }

    }
}

export default withErrorHandler;