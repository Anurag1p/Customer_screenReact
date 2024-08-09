import React, { useState, useEffect } from 'react';
import "../assets/mainscreen.css";
import PaymentMethodComponent from "./PaymentMethod"


const MainScreen = ({ id }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [products, setProducts] = useState([]);
  const [weight, setWeight] = useState(0);
  const cartId = id; // Use the dynamic id passed as a prop
  console.log("paymentDataMain", paymentData)
  console.log("products", products)

  const register = paymentData.register;
  console.log("regsiter", register)

  const webSocketData = () => {
    const productSocket = new WebSocket(`ws://192.168.68.130:5001/`);
    console.log("Anuragsocket", productSocket)

    productSocket.onopen = () => {
      console.log('WebSocket is open now');
    };

    productSocket.onerror = (e) => {
      console.error('WebSocket error:', e);
    };

    productSocket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("WebSocket message received:", data);
        setPaymentData(data?.data);
        setProducts(data?.data?.data || []);
        setWeight(data.data.weight);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    productSocket.onclose = (e) => {
      console.log('WebSocket is closed now.');
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        webSocketData();
      }, 5000); // Attempt to reconnect after 5 seconds
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      console.log('Cleaning up WebSocket connection.');
      productSocket.close();
    };
  };

  useEffect(() => {
    const cleanup = webSocketData();
    return cleanup;
  }, []);



  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <div id="main_screen" className="main_screen">

        {!paymentData?.payment_method?.length ?
          <div className="row">
            <div className="col-md-9">
              <div className="section-1">
                <table className="table-main">
                  <thead>
                    <tr>
                      <th className="thTitle productWidth">Product</th>
                      <th className="thTitle wgtQtyWidth">Wt/Qty</th>
                      <th className="thTitle priceWidth">Price ($)</th>
                      <th className="thTitle subtotalWidth">Sub Total ($)</th>
                    </tr>
                  </thead>
                  {cartId == register ?

                    <tbody className="productsText">
                      {products.map((product, index) => (

                        <tr key={index}>
                          <td className='productNames' dangerouslySetInnerHTML={{ __html: product.product_name }} />
                          <td className='productQuantity'>{product.quantity}</td>
                          <td className='productPrice'>{product.price}</td>
                          <td className='productSubtotal'>{((product.quantity) * product.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    : ""}

                </table>
              </div>

            </div>
            <div className="col-md-3">
              <div className="section-5">
                <table className="table-main">
                  <thead>
                    <tr>
                      <th className="thTitle">No. of items</th>
                      <th id="product_total">{products.length}</th>
                    </tr>
                    <tr>
                      <th className="thTitle">Amount</th>
                      <th id="amount_total">{(paymentData.total_amount?.toFixed(2)) || '000'}</th>
                    </tr>
                    <tr>
                      <th className="thTitle">Savings</th>
                      <th id="amount_saving">{paymentData.total_saving || '000'}</th>
                    </tr>
                    <tr>
                      <th className="thTitle">Tax</th>
                      <th id="amount_tax">{(paymentData.total_tax)?.toFixed(2) || '000'}</th>
                    </tr>
                    <tr>
                      <th className="thTitle">Payable Amount</th>
                      <th id="total_payable">${(paymentData.subtotal)?.toFixed(2) || '000'}</th>
                    </tr>
                    <tr>
                      <th className="thWeight">Weight (LB)</th>
                      <th id="total_weight">{weight || '00'}</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="section-2" id="customer_section">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th className="todayLoyalTh">Customer Name :</th>
                      <th id="name">{paymentData?.name || 'N/A'}</th>
                    </tr>
                    <tr>
                      <th className="todayLoyalTh">Today’s Loyalty Points :</th>
                      <th id="customer_loyalty_point">{paymentData?.Current_Loyalty_Point || '000'}</th>
                    </tr>
                    <tr>
                      <th className="todayLoyalTh">Available Points :</th>
                      <th id="loyalty_point">{paymentData?.Loyalty_Point || '000'}</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

          </div>
          : <PaymentMethodComponent paymentData={paymentData} />}


      </div>
      {!isFullScreen && (
        <button
          type="button"
          className="fullScreenBtnMain_screen"
          id="fullscreenButton"
          onClick={toggleFullScreen}
        >
          Full Screen
        </button>
      )}
    </>


  );
};

export default MainScreen;
