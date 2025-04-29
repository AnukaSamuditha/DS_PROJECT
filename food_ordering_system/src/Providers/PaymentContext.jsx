import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const setPaymentSuccess = () => setIsPaymentSuccessful(true);
    const setPaymentFailure = () => setIsPaymentSuccessful(false);

    return (
        <PaymentContext.Provider
            value={{
                isPaymentSuccessful,
                setPaymentSuccess,
                setPaymentFailure,
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);