import React, { useState } from 'react';
import axios from 'axios';

const PlaceOrderPage = () => {
  const [order, setOrder] = useState({
    user: {
      location: {
        lat: '',
        lng: '',
        address: '',
      },
    },
    shop: {
      id: '',
      name: '',
      location: {
        lat: '',
        lng: '',
        address: '',
      },
    },
    items: [
      { name: '', quantity: 1, price: 0 }
    ],
    amount: 0,
    deliveryFee: 0,
    paymentMethod: 'cash_on_delivery',
    notes: ''
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token'); // JWT token from login
  console.log(token);
  

  // Recalculate total amount
  const updateAmount = () => {
    const subtotal = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setOrder({ ...order, amount: subtotal });
  };

  const handleChange = (field, value) => {
    setOrder({ ...order, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
    setOrder({ ...order, items: updatedItems });
    updateAmount();
  };

  const addItem = () => {
    setOrder({ ...order, items: [...order.items, { name: '', quantity: 1, price: 0 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateAmount();

    try {
      const res = await axios.post(
        'http://localhost:6060/orders',
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('✅ Order placed successfully!');
      console.log('Order placed:', res.data);
    } catch (error) {
      console.error('Order failed:', error.response?.data || error.message);
      setMessage('❌ Failed to place order');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto', background:"white"}}>
      <h2>🛒 Place Order</h2>
      <form onSubmit={handleSubmit}>
        <h3>Shop Info</h3>
        <input placeholder="Shop ID" value={order.shop.id} onChange={(e) => handleChange('shop', { ...order.shop, id: e.target.value })} />
        <input placeholder="Shop Name" value={order.shop.name} onChange={(e) => handleChange('shop', { ...order.shop, name: e.target.value })} />
        <input placeholder="Shop Address" value={order.shop.location.address} onChange={(e) => handleChange('shop', {
          ...order.shop,
          location: { ...order.shop.location, address: e.target.value }
        })} />

        <h3>Delivery Location</h3>
        <input placeholder="Address" value={order.user.location.address} onChange={(e) =>
          setOrder({
            ...order,
            user: { ...order.user, location: { ...order.user.location, address: e.target.value } }
          })} />

        <h3>Items</h3>
        {order.items.map((item, index) => (
          <div key={index}>
            <input placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} />
            <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
            <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addItem}>➕ Add Item</button>
        {/* <button type='button' onClick={removeItem}></button> */}

        <h3>Delivery & Payment</h3>
        <input type="number" placeholder="Delivery Fee" value={order.deliveryFee} onChange={(e) => handleChange('deliveryFee', Number(e.target.value))} />
        <select value={order.paymentMethod} onChange={(e) => handleChange('paymentMethod', e.target.value)}>
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <textarea placeholder="Notes (optional)" value={order.notes} onChange={(e) => handleChange('notes', e.target.value)} />

        <button type="submit" style={{ marginTop: '1rem', color:"blue"}}>🚀 Place Order</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default PlaceOrderPage;
