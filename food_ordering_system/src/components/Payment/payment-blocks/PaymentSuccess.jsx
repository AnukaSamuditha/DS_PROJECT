import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../PaymentContext.jsx";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export const PaymentSuccess = () => {
    const { isPaymentSuccessful } = usePayment();
    const navigate = useNavigate();


    useEffect(() => {
        if (!isPaymentSuccessful) {
            navigate("/");
        }
    }, [isPaymentSuccessful, navigate]);

    return isPaymentSuccessful ? (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="flex w-[30rem] h-[50rem] bg-white flex items-start justify-center rounded-md shadow-lg">
                <div className="w-full h-[20%] rounded-md flex justify-center items-center p-8">
                    <DotLottieReact
                        src="https://lottie.host/2e7cd5b8-a4ce-4720-b30b-b399d054852c/MdRhLryjf2.lottie"
                        loop
                        autoplay

                    />
                </div>
            </div>

        </div>
    ) : null;
};