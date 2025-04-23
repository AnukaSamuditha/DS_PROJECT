import { createContext, useContext, useState, useCallback } from 'react';

const OrderContext = createContext();

export default function OrderStatusProvider({ children }) {
    const [orderStatus, setOrderStatus] = useState("pending");

    // Memoize the status update function to prevent unnecessary re-renders
    const handleOrderStatus = useCallback((newStatus) => {
        setOrderStatus(newStatus);
        console.log("ORDER CONTEXT UPDATED ", newStatus);
    }, []);

    return (
        <OrderContext.Provider value={{ orderStatus, handleOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrder = () => useContext(OrderContext);