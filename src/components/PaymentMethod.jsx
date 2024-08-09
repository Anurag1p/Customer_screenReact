



import React, { useState, useEffect } from 'react';
import "../assets/css/paymentMethod.css"
const PaymentMethodComponent = ({ paymentData }) => {
    const [paymentDetails, setPaymentDetails] = useState({
        name: 'N/A',
        loyaltyPoint: 0,
        totalAmount: 0,
        totalPaid: 0,
        paymentMethod: '',
        changeBalance: 0,
    });

    useEffect(() => {
        if (paymentData) {
            const paymentSummary = paymentData.payment_method.reduce((acc, method) => {
                if (acc[method.name]) {
                    acc[method.name] += method.payment;
                } else {
                    acc[method.name] = method.payment;
                }
                return acc;
            }, {});

            const paymentMethodString = Object.entries(paymentSummary)
                .map(([name, payment]) => `${name}: $${payment.toFixed(2)}`)
                .join(', ');

            setPaymentDetails({
                name: paymentData?.name || 'N/A',
                loyaltyPoint: paymentData?.Loyalty_Point || 0,
                totalAmount: paymentData?.total_amount || 0,
                totalPaid: paymentData?.total_paid || 0,
                paymentMethod: paymentMethodString,
                changeBalance: paymentData?.change || 0,
            });
        }
    }, [paymentData]);

    return (
   <div className="payment-container">
            <div className="payment-card">
                <div className="payment-header">
                    Payment Details
                </div>
                <table className="payment-table">
                    <tbody>
                        <tr>
                            <td className="payment-label">Name:</td>
                            <th id="name_payment" className="payment-value">{paymentDetails.name}</th>

                        </tr>
                        <tr>
                            <td className="payment-label">Loyalty Points:</td>
                            <td id="loyalty_point_payment" className="payment-value">{paymentDetails?.loyaltyPoint}</td>
                        </tr>
                        <tr >
                            <td className="payment-label ">Total Amount:</td>
                            <td id="amount_total_payment " className="payment-value totalAmuntVal">${paymentDetails.totalAmount.toFixed(2)}</td>
                        </tr>
                        <tr >
                            <td className="payment-label totalPaid">Total Paid:</td>
                            <td id="total_paid" className="payment-value paymentPaid">${paymentDetails.totalPaid.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className="payment-label paymentMethod">Payment Method:</td>
                            <td id="method_of_payment" className="payment-value paymentMethodVal">{paymentDetails.paymentMethod}</td>
                        </tr>
                        <tr>
                            <td className="payment-label">Change:</td>
                            <td id="change_balance" className="payment-value">{paymentDetails.changeBalance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default PaymentMethodComponent;

