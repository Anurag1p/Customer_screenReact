import React, { useState, useEffect } from 'react';
import "../assets/mainscreen.css";
import PaymentMethodComponent from "./PaymentMethod";

const MainScreen = ({ id }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [paymentData, setPaymentData] = useState({});
  const [products, setProducts] = useState([]);
  const [weight, setWeight] = useState(0);
  const cartId = id; // Use the dynamic id passed as a prop

  console.log("paymentData_data", products)
  const register = paymentData?.register;
  let reconnectInterval = 5000; // Initial reconnection interval

  // WebSocket for Products
  const webSocketData = () => {
    const productSocket = new WebSocket(`ws://127.0.0.1:5001/`);

    productSocket.onopen = () => {
      console.log('WebSocket is open now');
      reconnectInterval = 5000; // Reset the interval on successful connection
    };

    productSocket.onerror = (e) => {
      console.error('WebSocket error:', e.message, e);
    };

    productSocket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("websocket_data", data)
        setPaymentData(data?.data);
        setProducts(data?.data?.data || []);
        console.log("productsHello", products)
        // if (paymentData.length > 0) {
          localStorage.setItem('products', JSON.stringify(paymentData));
        // }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    productSocket.onclose = (e) => {
      console.log('WebSocket is closed now.');
      setTimeout(() => {
        webSocketData();
      }, reconnectInterval);
      reconnectInterval *= 2; // Exponential backoff
    };

    return () => {
      productSocket.close();
    };
  };

  // WebSocket for Weight
  const load_weight_from_websocket = () => {
    const webSocketUrl = `ws://localhost:8765`;
    let web_socket_weight;
    let intervalId;
    let lastMessageTime = Date.now();

    const connectWebSocket = () => {
      if (web_socket_weight) {
        web_socket_weight.close();
      }

      web_socket_weight = new WebSocket(webSocketUrl);

      web_socket_weight.onopen = () => {
        console.log("WebSocket connection opened for weight");
        clearInterval(intervalId);
        reconnectInterval = 5000; // Reset interval on successful connection
      };

      web_socket_weight.onerror = (error) => {
        console.error('WebSocket error:', error.message, error);
      };

      web_socket_weight.onmessage = (event) => {
        lastMessageTime = Date.now();
        clearInterval(intervalId);

        let weight = JSON.parse(event.data);
        setWeight(weight.weight);

        intervalId = setInterval(checkConnectionHealth, 10000); // Check every 10 seconds
      };

      web_socket_weight.onclose = () => {
        console.log("WebSocket for weight closed. Attempting to reconnect...");
        setTimeout(() => {
          connectWebSocket(); // Attempt to reconnect
        }, reconnectInterval);
        reconnectInterval *= 2; // Exponential backoff
      };
    };

    const checkConnectionHealth = () => {
      const currentTime = Date.now();
      if (currentTime - lastMessageTime > 10000) {
        setWeight(0); // Reset to default weight if no message received in the last 10 seconds
      }
    };

    connectWebSocket(); // Initial connection

    return () => {
      if (web_socket_weight) {
        web_socket_weight.close();
      }
      clearInterval(intervalId);
    };
  };


  useEffect(() => {
    const cleanupProductSocket = webSocketData();
    const cleanupWeightSocket = load_weight_from_websocket();

    return () => {
      cleanupProductSocket();
      cleanupWeightSocket();
    };
  }, []);

  // Fullscreen functionality
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
      {/* {products.length > 0 ? ( */}
        <div id="main_screen" className="main_screen">
          {!paymentData?.payment_method?.length ? (
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
                    {cartId === register && (
                      <tbody className="productsText">
                        {products.map((product, index) => (
                          <tr key={index}>
                            <td className='productNames' dangerouslySetInnerHTML={{ __html: product.product_name }} />
                            <td className='productQuantity'>{product.quantity}</td>
                            <td className='productPrice'>{(product.price).toFixed(2)}</td>
                            <td className='productSubtotal'>{(product.quantity * product.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    )}
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
                        <th id="amount_total">{(paymentData?.total_amount?.toFixed(2)) || '000'}</th>
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
          ) : (
            <PaymentMethodComponent paymentData={paymentData} />
          )}
        </div>
      {/* ) : <PaymentMethodComponent paymentData={paymentData} />} */}



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
