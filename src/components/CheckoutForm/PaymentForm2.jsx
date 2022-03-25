import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core'
import {Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PaystackButton } from "react-paystack";
import Review from './Review'


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const PaymentForm2 = ({checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout, timeout}) => {
    
   
  const publicKey = "pk_test_991ef6cfc641dd4b948b2cac759d00d34d3ef116";
    const amount = `${checkoutToken.live.subtotal.formatted_with_symbol}`;

    // console.log(checkoutToken.live.subtotal.formatted_with_symbol);

  const componentProps = {
    line_item: checkoutToken.live.line_items,
    amount,
    metadata: {
      firstname: shippingData.firstName,
      lastname: shippingData.lastName,
    },
    email: shippingData.email,
    publicKey,
    text: "Pay Now",
    onSuccess: () =>
      alert("Thanks for doing business with us! Come back soon!!"),
    onClose: () => alert("Wait! Don't leave :("),
  };

  const handleSubmit = async(e, elements, stripe) => {
    e.preventDefault()

    if(!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement)

    const {error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card: cardElement})

    if (error) {
      console.log(error);
    }else{
      const orderData = {
        line_item: checkoutToken.live.line_items,
        customer: {firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email},
        shipping: {
          name: 'Primary',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
         },
         fulfilment: {shipping_method: shippingData.shippingOption},
         payment: {
           gateway: 'stripe',
           stripe: {
             payment_method_id: paymentMethod.id
           }
         }
      }
     
      
      onCaptureCheckout(checkoutToken.id, componentProps);

      timeout()

      nextStep()
      
    }
  }
  return (
    <>
        <Review checkoutToken={checkoutToken}/>
        <Divider />
        <Typography variant='h6' gutterBottom style={{margin: '20px 0'}}> Payment Method</Typography>
            <PaystackButton {...componentProps} onSubmit={handleSubmit}/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                {/* <Button type='submit' variant='contained' color='primary'> Pay {checkoutToken.live.subtotal.formatted_with_symbol} </Button> */}
            </div>
        {/* <Elements stripe={stripePromise}>
            <ElementsConsumer>
              {(({elements, stripe})=> (
                <form onSubmit={e => handleSubmit(e, elements, stripe)}>
                  <CardElement />
                  <br />
                  <br />
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant='outlined' onClick={backStep}>Back</Button>
                    <Button type='submit' variant='contained' disabled={!stripe} color='primary'> Pay {checkoutToken.live.subtotal.formatted_with_symbol} </Button>
                  </div>
                </form>
              ))}
            </ElementsConsumer>
        </Elements> */}
    </>
  )
}

export default PaymentForm2