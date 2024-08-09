import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentInfo = () => {
    const [cartId, setCartId] = useState(null);
    const [paymentData, setPaymentData] = useState({
        name: '',
        loyaltyPoint: '',
        totalAmount: '',
        paymentMethod: '',
        changeBalance: '',
    });

    useEffect(() => {
        // Fetch cart ID (replace this with actual method to get cart ID)
        const fetchCartId = async () => {
            // Simulating fetching cart ID
            setCartId('exampleCartId'); // Replace with actual logic to get cartId
        };

        fetchCartId();
    }, []);

    useEffect(() => {
        if (cartId) {
            const interval = setInterval(() => {
                loadProducts();
            }, 500);

            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [cartId]);

    const loadProducts = async () => {
        try {
            const response = await axios.get(`/cart/${cartId}/`);
            const result = response.data;

            let paymentMethod = result.payment_method || '';
            let changeBalance = result.change || '';

            if (!paymentMethod && result.data.length > 0) {
                window.location.replace(`http://127.0.0.1:5000/${cartId}`);
            } else {
                setPaymentData({
                    name: result.name || '',
                    loyaltyPoint: result.Loyalty_Point || '',
                    totalAmount: `$${(Math.round(result.total_amount * 100) / 100).toFixed(2)}`,
                    paymentMethod: paymentMethod,
                    changeBalance: changeBalance,
                });
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    return (
        <div className="section-5" style={{ position: 'absolute', transform: 'translate(-50%,-50%)', top: '38%', left: '50%', width: '70%' }}>
            <table className="table-main" style={{ height: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr id="name_row" style={{ fontSize: '2.5vw' }}>
                        <th>Name :</th>
                        <th id="name" style={{
                            backgroundColor: 'rgb(252, 252, 252)',
                            color: '#068b23',
                            border: '2px solid #fff inset'
                        }}>
                            {paymentData.name || '000'}
                        </th>
                    </tr>
                    <tr id="loyalty_row" style={{ fontSize: '2.5vw' }}>
                        <th>Loyalty Point :</th>
                        <th id="loyalty_point" style={{
                            backgroundColor: 'rgb(252, 252, 252)',
                            color: '#068b23',
                            border: '2px solid #fff inset'
                        }}>
                            {paymentData.loyaltyPoint || '000'}
                        </th>
                    </tr>
                    <tr style={{ fontSize: '2.5vw' }}>
                        <th>Total Amount :</th>
                        <th id="amount_total" style={{
                            backgroundColor: 'rgb(252, 252, 252)',
                            color: '#068b23',
                            border: '2px solid #fff inset'
                        }}>
                            {paymentData.totalAmount || '000'}
                        </th>
                    </tr>
                    <tr style={{ fontSize: '2.5vw' }}>
                        <th>Payment Method :</th>
                        <th id="method_of_payment" style={{ backgroundColor: 'rgb(252, 252, 252)' }}>
                            {paymentData.paymentMethod || ''}
                        </th>
                    </tr>
                    <tr style={{ fontSize: '4.5vmin' }}>
                        <th style={{ height: '90px', fontWeight: '400' }}>Change :</th>
                        <th id="change_balance" style={{
                            backgroundColor: 'rgb(252, 252, 252)',
                            color: '#068b23',
                            border: '2px solid #fff inset',
                            fontWeight: '500'
                        }}>
                            {paymentData.changeBalance || '000'}
                        </th>
                    </tr>
                </thead>
            </table>
            <label style={{ display: 'none' }} id="cart_id">{cartId}</label>
        </div>
    );
};

export default PaymentInfo;
