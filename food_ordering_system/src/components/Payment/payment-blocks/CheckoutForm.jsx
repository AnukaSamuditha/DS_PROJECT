import React, { useState } from "react";
import Master from './images/paymethod1.svg';
import Amex from './images/paymethod2.svg';
import Visa from './images/paymethod3.svg';
import {useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement} from "@stripe/react-stripe-js";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";



const useSavePayment = () =>

    useMutation({
        mutationFn: async (paymentData) => {
            console.log(paymentData)
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_PREFIX}/payment/create`,
                paymentData,
                { withCredentials: true }
            );
            return res.data;

        },
    });




export const CheckoutForm = ({ clientSecret,userId,customerId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const queryClient = useQueryClient();



    const { mutate: savePayment } = useSavePayment();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);

        const cardElement = elements.getElement(CardNumberElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            setMessage(error.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setMessage("Payment succeeded!");
            console.log(paymentIntent)

            try {
                savePayment({
                    userId,
                    customerId,
                    amount: paymentIntent.amount / 100,
                    status: paymentIntent.status,
                    paymentId: paymentIntent.id,
                });

                sendPayment.mutate({
                    userId,
                    customerId,
                    amount: paymentIntent.amount / 100,
                    status: paymentIntent.status,
                    paymentId: paymentIntent.id,
                });
            } catch (err) {
                console.error("Payment succeeded but post-processing failed:", err);
                setMessage("Payment was successful, but something went wrong afterward.");
            }

        } else {
            setMessage("Unexpected state");
        }

        setIsProcessing(false);
    };

    const ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: "15px",
                color: "#32325d",
                fontFamily: "Geist, sans-serif",
                "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#e53e3e" },
        }
    };


    const sendPayment = useMutation({
        mutationFn: async (mailData) => {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_PREFIX}/send`,
                mailData,
                { withCredentials: true }
            );
            return response.data;
        },
    });

    const deleteItem = useMutation({
        mutationFn: async ({ cartId, productId }) => {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_PREFIX}/cart/item`,
                { cartId, productId },
                { withCredentials: true }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);
        },
    });


    return (
        <div className="flex flex-col items-center justify-center h-full">
            <form id="payment-form" onSubmit={handleSubmit}
                  className="flex flex-col items-center justify-center h-full w-full">
                <div className="h-[90%] w-full rounded-md p-4 flex items-center justify-center">
                    <div className="w-full h-[100%] flex flex-col items-center justify-center bg-white rounded-md">
                        <div className="font-semibold text-[20px] w-full p-2 h-[10%] flex items-center justify-center">
                            Enter Card Info:
                        </div>
                        <div className="w-full flex items-center justify-center h-[40%]">
                            <div className="w-full flex flex-col justify-center items-center gap-3 px-2 h-[100%]">
                                <div className="w-full p-1 flex flex-col ">
                                    <label>Card Number</label>
                                    <div className="w-full border-gray-500 border p-3 rounded-md">
                                        <CardNumberElement options={ELEMENT_OPTIONS}/>
                                    </div>
                                </div>

                                <div className="w-full p-1 flex flex-row justify-between items-center">
                                    <div className="w-[72%]">
                                        <label>Expiry</label>
                                        <div className="w-full border-gray-500 border p-3 rounded-md">
                                            <CardExpiryElement options={ELEMENT_OPTIONS}/>
                                        </div>
                                    </div>

                                    <div className="w-[25%]">
                                        <label>CVC</label>
                                        <div className="w-full border-gray-500 border p-3 rounded-md text-center">
                                            <CardCvcElement options={ELEMENT_OPTIONS}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center h-[10%]">
                            <p className="text-xs text-gray-500 text-center text-wrap text-justify p-4">
                                Payments are securely processed by Stripe. We do not store your card details.
                                <a
                                    href="https://stripe.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-gray-700"
                                >
                                    Learn more about Stripe’s privacy policy
                                </a>.
                            </p>
                        </div>
                        <div className="w-full flex justify-center items-center gap-3 px-2 h-[15%]">
                            <img src={Master} alt="Master" className="h-10"/>
                            <img src={Amex} alt="Amex" className="h-10"/>
                            <img src={Visa} alt="Visa" className="h-10"/>
                        </div>
                        <div className="w-full h-[10%] flex items-center justify-center">
                            {message && (
                                <div
                                    id="payment-message"
                                    className={`flex justify-center items-center ${
                                        message.includes("incomplete") || message.includes("failed") || message.includes("invalid") ? "text-red-500" : "text-black"
                                    }`}
                                >
                                    {message}
                                </div>
                            )}
                        </div>

                        <div className="w-full h-[10%] flex justify-center items-center">
                            {message ? (
                                <div className="flex justify-center items-center" id="payment-message">
                                    {message.includes("succeeded") ? (
                                        <DotLottieReact
                                            src="https://lottie.host/f0b03c79-c322-4b3e-b6e1-06d2594c094c/oF5TT1zy1E.lottie"
                                            autoplay
                                            loop={false}
                                            height="50"
                                            width="50"
                                        />
                                    ) : (
                                        <DotLottieReact src="https://lottie.host/857e956b-8ed0-4eb5-bb4b-498a740c5d0e/T7P1g2wA9W.lottie" loop={false} autoplay height="30" width="30"/>
                                    )}
                                </div>
                            ) : (
                                isProcessing && (
                                    <Ring2
                                        size="40"
                                        stroke="5"
                                        strokeLength="0.25"
                                        bgOpacity="0.1"
                                        speed="0.8"
                                        color="black"
                                    />
                                )
                            )}

                        </div>


                    </div>
                </div>

                <div className="h-[10%] flex items-center justify-center p-2 w-full">
                    <button
                        disabled={isProcessing || !stripe || !elements}
                        id="submit"
                        className="flex justify-center items-center h-full w-full"
                    >
                        <div
                            className="bg-black text-white font-semibold text-2xl w-full h-full rounded-md flex justify-center items-center">
                            {isProcessing ? "Processing..." : "Pay now"}
                        </div>
                    </button>
                </div>
            </form>
        </div>

    );
};