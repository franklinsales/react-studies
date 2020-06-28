/* eslint-disable import/first */

import React from 'react'

import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import NavigationItems from './NavigationItems'
import NavitationItem from './NavigationItem/NavigationItem'

configure({adapter: new Adapter()})

describe('<NavigationItems/>', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallow(<NavigationItems />)
    })

    it('should render two <NavitationItem /> elements if not authenticated',() => {
        expect(wrapper.find(NavitationItem)).toHaveLength(2)
    })

    it('should render three <NavitationItem /> elements if authenticated',() => {
        wrapper.setProps({isAuthenticated: true})
        expect(wrapper.find(NavitationItem)).toHaveLength(3)
    })

    it('should an exact logout button',() => {
        wrapper.setProps({isAuthenticated: true})
        expect(wrapper.contains(<NavitationItem link="/logout">Logout</NavitationItem>)).toEqual(true)
    })
})