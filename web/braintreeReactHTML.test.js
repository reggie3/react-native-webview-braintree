import React from '../react.production.min.js';
import BraintreeReactHTML from './braintreeReactHTML.js';
import { shallow, mount } from 'enzyme';

describe('<BraintreeReactHTMLw/>', () => {
  it('renders without crashing', () => {
    const component = shallow(<BraintreeReactHTML />);
    expect(component).toHaveLength(1);
  });

  it('displays purchase button if the payment has not been submitted', () => {
    const component = shallow(<BraintreeReactHTML />);
    if (component.state().currentPaymentStatus !== true) {
      expect(component.find('#submit-button').exists()).toBe(true);
    }
  });
  it('displays a thank you message after purchase is fulfilled', () => {
    const component = shallow(<BraintreeReactHTML />);
    component.setState({currentPaymentStatus: "PURCHASE_FULFILLED"})
    if (component.state().currentPaymentStatus !== true) {
      expect(component.find('#purchase-fulfilled-message').exists()).toBe(true);
    }
  });
  it('displays a rejection message if purchase is rejected', () => {
    const component = shallow(<BraintreeReactHTML />);
    component.setState({currentPaymentStatus: "PURCHASE_REJECTED"})
    if (component.state().currentPaymentStatus !== true) {
      expect(component.find('#purchase-reject-message').exists()).toBe(true);
    }
  });
});
