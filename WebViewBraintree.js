import React from './react.production.min.js';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

export default class BraintreePaymentWebview extends React.Component {
  constructor() {
    super();

    this.state = {
      paymentAPIResponse: null,
      showGetNonceActivityIndicator: false,
      showSubmitPaymentActivityIndicator: false
    };
  }
  componentDidMount() {
    // register listeners to listen for events from the html
    // we'll receive a nonce once the requestPaymentMethodComplete is completed
    this.registerMessageListeners();
    console.log('wbvw braintree mounted');
  }

  registerMessageListeners = () => {
    const { messagesChannel } = this.webview;

    messagesChannel.on('RETRIEVE_NONCE_PENDING', event => {
      this.setState({ showGetNonceActivityIndicator: true });
      console.log('RETRIEVE_NONCE_PENDING');
    });

    messagesChannel.on('RETRIEVE_NONCE_FULFILLED', event => {
      console.log('RETRIEVE_NONCE_FULFILLED');
      this.setState({ showGetNonceActivityIndicator: false });
      this.setState({ showSubmitPaymentActivityIndicator: true });
      this.props.nonceObtainedCallback(event.payload.response.nonce);
    });

    messagesChannel.on('RETRIEVE_NONCE_REJECTED', event => {
      console.log('RETRIEVE_NONCE_REJECTED');
      this.setState({ showGetNonceActivityIndicator: false });
    });

    messagesChannel.on('GO_BACK', () => {
      this.props.navigationBackCallback();
    });
  };

  // send the client token to HTML file to begin the braintree flow
  // called when the HTML in the webview is loaded
  sendClientTokenToHTML = () => {
    this.webview.emit('TOKEN_RECEIVED', {
      payload: {
        clientToken: this.props.clientToken,
        options: this.props.options
      }
    });
  };

  // handle purchase responses that parent component sends after making purchase API call
  handlePurchaseResponse = response => {
    console.log('handlePurchaseResponse');
    if (response === 'PAYMENT_SUCCESS') {
      console.log('emitting purchaseSuccess');
      this.setState({ showSubmitPaymentActivityIndicator: false });
      this.webview.emit('PURCHASE_FULFILLED');
    } else {
      this.setState({ showSubmitPaymentActivityIndicator: false });
      this.webview.emit('PURCHASE_REJECTED');
    }
  };

  componentWillReceiveProps = nextProps => {
    console.log({ nextProps });
    if (nextProps.paymentAPIResponse !== this.state.paymentAPIResponse) {
      console.log(nextProps.paymentAPIResponse);
      this.setState({ paymentAPIResponse: nextProps.paymentAPIResponse });
      this.handlePurchaseResponse(nextProps.paymentAPIResponse);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'green'
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'blue',
            overflow: 'hidden'
          }}
        >
          <WebView
            onLoad={this.sendClientTokenToHTML}
            source={require('./dist/index.html')}
            style={{ flex: 1 }}
            ref={component => (this.webview = component)}
            scalesPageToFit ={false}
          />
        </View>
        {renderIf(this.state.showGetNonceActivityIndicator)(
          <View style={styles.activityOverlayStyle}>
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                animating={this.state.showGetNonceActivityIndicator}
                color="blue"
              />
            </View>
          </View>
        )}
        {renderIf(this.state.showSubmitPaymentActivityIndicator)(
          <View style={styles.activityOverlayStyle}>
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                animating={this.state.showSubmitPaymentActivityIndicator}
                color="green"
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

BraintreePaymentWebview.propTypes = {
  options: PropTypes.object,
  clientToken: PropTypes.string.isRequired,
  paymentAPIResponse: PropTypes.string.isRequired,
  nonceObtainedCallback: PropTypes.func.isRequired,
  navigationBackCallback: PropTypes.func
};

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(150, 150, 150, .55)',
    marginHorizontal: 20,
    marginVertical: 60,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5
  },
  activityIndicatorContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});