import React from 'react'
import "../assets/css/counternew.css"

const CounterClosedMessage = () => {
    return (
        <div className="centerChild">
          <div className="textBox" role="alert">
            <p className="counterText">Counter Closed !!</p>
          </div>
        </div>
      );
}

export default CounterClosedMessage;
