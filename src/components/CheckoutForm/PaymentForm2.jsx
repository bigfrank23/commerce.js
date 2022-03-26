import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core'
import { PaystackButton } from "react-paystack";
import Review from './Review'
import useStyles from './styles'

const PaymentForm2 = ({checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout, timeout}) => {
  const classes = useStyles()
  // const publicKey = process.env.REACT_APP_PAYSTACK_KEY;
  const componentProps = {
    line_item: checkoutToken.live.line_items,
    metadata: {
      firstname: shippingData.firstName,
      lastname: shippingData.lastName,
    },
    firstname: shippingData.firstName,
    lastname: shippingData.lastName,
    email: shippingData.email,
    publicKey: process.env.REACT_APP_PAYSTACK_KEY,
    shipping: {
      name: 'Primary',
      street: shippingData.address1,
      town_city: shippingData.city,
      county_state: shippingData.shippingSubdivision,
      postal_zip_code: shippingData.zip,
      country: shippingData.shippingCountry,
    },
    fulfilment: {shipping_method: shippingData.shippingOption},
    text: `Pay ${checkoutToken.live.subtotal.formatted_with_symbol} now`,
    onSuccess: () => nextStep(),
    onClose: () => alert("Wait! Don't leave :("),
    // onCaptureCheckout(checkoutToken.id, componentProps),
    // timeout(),
    // nextStep()
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        {" "}
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={backStep}>
          Back
        </Button>
        <PaystackButton
          {...componentProps}
          amount={checkoutToken.live.subtotal.raw * 100}
          className={classes.paystackButton}
        />
      </div>
    </>
  );
}

export default PaymentForm2
