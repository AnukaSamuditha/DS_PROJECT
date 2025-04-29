import React, {useEffect,useState} from 'react'
import {loadStripe} from "@stripe/stripe-js";
import axios from "axios";
import {CheckoutForm} from "@/components/Payment/payment-blocks/CheckoutForm.jsx";
import {Elements} from "@stripe/react-stripe-js";


export const StripeElement = ({cartId,totalPrice,userId,user}) => {
    const [stripePromise,setStripePromise] = useState(null);
    const [clientSecret,setClientSecret] = useState("")

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_PREFIX}/config`)
            .then((response) => {
                const { publishableKey } = response.data;
                console.log(publishableKey);
                setStripePromise(loadStripe(publishableKey));
            })
            .catch((err) => {
                console.error("Error fetching config:", err);
            });
    }, []);




    useEffect(() => {
        if (!cartId || !totalPrice || !userId || !user) return;

        const createPaymentIntent = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_PREFIX}/create-payment-intent`,
                    {
                        cartId,
                        userId,
                        receipt_email:user.email,
                        customerId:user.customerId,
                        amount: totalPrice,

                    },
                    { withCredentials: true }
                );

                const { clientSecret } = response.data;
                setClientSecret(clientSecret);
            } catch (err) {
                console.error("Error creating payment intent:", err);
            }
        };

        createPaymentIntent();
    }, [cartId, totalPrice, userId,user]);


    return (
        <div className="h-full w-full">
            {stripePromise && clientSecret &&(
                <Elements stripe={stripePromise} options={{clientSecret}}>
                    <CheckoutForm clientSecret={clientSecret} cartId={cartId} totalPrice={totalPrice} userId={userId} customerId={user.customerId}/>
                </Elements>
            )}



        </div>

    )
}
