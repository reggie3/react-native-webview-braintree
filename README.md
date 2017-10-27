## React Native Webview Braintree
# A Braintree payment component with no native code for React Native apps.

[![npm](https://img.shields.io/npm/v/react-native-webview-braintreee.svg)](https://www.npmjs.com/package/react-native-webview-braintree)
[![npm](https://img.shields.io/npm/dm/react-native-webview-braintree.svg)](https://www.npmjs.com/package/react-native-webview-braintree)
[![npm](https://img.shields.io/npm/dt/react-native-webview-braintree.svg)](https://www.npmjs.com/package/react-native-webview-braintree)
[![npm](https://img.shields.io/npm/l/react-native-webview-braintree.svg)](https://github.com/react-native-component/react-native-webview-braintree/blob/master/LICENSE)

Usage
~~~~
<WebViewBraintree
    clientToken={this.state.clientToken}
    nonceObtainedCallback={this.handlePaymentMethod}
    navigationBackCallback={this.navigationBackCallback}
    paymentAPIResponse={this.state.paymentAPIResponse}
/>	
~~~~

This component accepts the following props
* clientToken
* nonceObtainedCallback
* navigationBackCallback
* paymentAPIResponse

| Name                   | Required      | Description |
| ---------------------- | ------------- | ----------- |
| clientToken            |    yes        | Braintree [client token used to create the dropin UI](https://developers.braintreepayments.com/start/hello-client/javascript/v3#get-a-client-token)|
| nonceObtainedCallback  |    yes        | Function called once a Braintree payment nonce is obtained, the nonce value is passed to ehe function as the only parameter|
| paymentAPIResponse     |    yes        | A string indicated the success of the an API to Braintree transaction API.  The string should be either "PAYMENT_SUCCESS" "PAYMENT_REJECTED"|
| navigationBackCallback |    no         | Function that can be called in order to initiate navigation.  This function will be called when the user clicks on a button labeled "Return to Shop" that appears after a rejected or successful purchase |


Example use of the paymentAPIResponse string
~~~
brainTreeUtils
    .postPurchase(nonce, this.props.cart.totalPrice, {})
    .then(response => {
        if (response.type === "success") {
            this.setState({ paymentAPIResponse: "PAYMENT_SUCCESS" });
            this.props.dispatch(actions.cartActions.emptyCart());
        } else {
            this.setState({ paymentAPIResponse: "PAYMENT_REJECTED" });
        }
});
~~~

## Example Application
[React Native Webview Braintree test application](https://github.com/reggie3/react-native-webview-braintree-test-app)

## TODOs
Integrate Paypal payments

## LICENSE

MIT
