
  load_weight_from_websocket();
  load_products_from_websockets();
  function autoScroll() {
    document.getElementById("productlist").scrollLeft += "500"
  }

  var btn = document.getElementById('fullscreenButton');

  function toggleFullScreen() {
    const fsButton = document.getElementById('fullscreenButton');

    if (!document.fullscreenElement) {
      // Requesting full-screen mode for the document element
      document.documentElement.requestFullscreen()
        .catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      // Exiting full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .catch(err => {
            alert(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
          });
      }
    }
  }

  btn.onclick = function () {
    toggleFullScreen(); 
  };

  document.addEventListener('fullscreenchange', () => {
    const fsButton = document.getElementById('fullscreenButton');
    if (document.fullscreenElement) {
      fsButton.style.display = "none"; // Hide button when in fullscreen
    } else {
      fsButton.style.display = "block"; // Show button when not in fullscreen
    }
  });

  // Initial check on page load to ensure the button is correctly displayed
  document.addEventListener('DOMContentLoaded', () => {
    const fsButton = document.getElementById('fullscreenButton');
    if (document.fullscreenElement) {
      fsButton.style.display = "none";
    } else {
      fsButton.style.display = "block";
    }
  });

  function load_payment(data) {
    // Parse the incoming JSON data
    var result = JSON.parse(data); // Assuming data is a JSON string

    // Process the received payment information
    var paymentData = result;

    // DOM elements
    var customer_name = document.getElementById('name_payment');
    var loyalty_row = document.getElementById('loyalty_row');
    var name_row = document.getElementById('name_row');
    var method_payment = document.getElementById('method_of_payment');

    // Extract payment method data
    let payment_methods = paymentData.data.payment_method;

    // Calculate totals by payment method
    const paymentSummary = payment_methods.reduce((summary, payment) => {
        if (!summary[payment.name]) {
            summary[payment.name] = 0;
        }
        summary[payment.name] += payment.payment;
        return summary;
    }, {});

    // Prepare HTML content for payment methods
    let paymentDetailsHtml = '';
    for (const [method, total] of Object.entries(paymentSummary)) {
        paymentDetailsHtml += `${method}: &#36; ${(Math.round(total * 100) / 100).toFixed(2)}<br>`;
    }

    // Set the inner HTML of the <th> element
    method_payment.innerHTML = paymentDetailsHtml;

    // Display payment details
    var old_loyalty_point = document.getElementById('loyalty_point_payment');
    old_loyalty_point.innerHTML = paymentData.data.Loyalty_Point;

    var total_payable = document.getElementById('amount_total_payment');
    total_payable.innerHTML = `&#36; ${(Math.round(paymentData.data.total_amount * 100) / 100).toString()}`;

    var remain_balance = document.getElementById('change_balance');
    remain_balance.innerHTML = `&#36; ${paymentData.data.change}`;

    var total_paid_tr = document.getElementById('total_paid_tr');
    var total_paid = document.getElementById('total_paid');

    // Determine how to display total paid based on payment method
    let payment_method_names = payment_methods.map(method => method.name);
    if (payment_method_names.includes("Cash") || payment_method_names.includes("OTC") || payment_method_names.includes("Credit Customer")) {
        total_paid.innerHTML = `&#36; ${(Math.round(paymentData.data.total_paid * 100) / 100).toString()}`;
    } else {
        total_paid.innerHTML = `&#36; ${(Math.round(paymentData.data.total_amount * 100) / 100).toString()}`;
    }

    // Display customer name if available
    if (typeof paymentData.data.name !== "undefined" && paymentData.data.name !== "") {
        customer_name.innerHTML = paymentData.data.name;
    } else {
        loyalty_row.style.display = "none";
        name_row.style.display = "none";
    }
}



  function load_products_from_websockets() {
    var reconnectInterval = 5000; // Time in milliseconds between reconnection attempts
    var ws; // Declare the WebSocket variable at a higher scope for reuse

    function connect() {
      ws = new WebSocket(`ws://${window.location.hostname}:5001/websocket/products`);

      ws.onopen = function (event) {
        console.log("WebSocket connection opened", event);
      };

      ws.onerror = function (error) {
        console.error('WebSocket error:', error);
      };

      ws.onmessage = function (event) {
        console.log('Received message:', event.data);
        load_websocket_products(event.data);
      };

      ws.onclose = function (event) {
        console.log("Product WebSocket closed unexpectedly. Attempting to reconnect...");
        // Schedule reconnection
        setTimeout(connect, reconnectInterval);
      };
    }

    connect(); // Call the connect function to establish the WebSocket connection initially
  }


  function load_weight_from_websocket() {
    var webSocketUrl = `ws://localhost:8765`;
    var web_socket_weight;
    var intervalId;
    var lastMessageTime = Date.now();

    function connectWebSocket() {
      // Close existing WebSocket if open
      if (web_socket_weight) {
        web_socket_weight.close();
      }

      // Create a new WebSocket connection
      web_socket_weight = new WebSocket(webSocketUrl);

      web_socket_weight.onopen = function (event) {
        console.log("WebSocket connection opened for weight");
        // Clear any existing interval
        clearInterval(intervalId);
      };

      web_socket_weight.onerror = function (error) {
        console.error('WebSocket error:', error);
      };

      web_socket_weight.onmessage = function (event) {
        console.log('Received message weight:', event.data);
        lastMessageTime = Date.now();
        clearInterval(intervalId);
        processWeightData(event.data);

        // Reset the interval
        intervalId = setInterval(checkConnectionHealth, 10000); // check every 10 seconds
      };

      web_socket_weight.onclose = function (event) {
        console.log("WebSocket for weight closed. Attempting to reconnect...");
        connectWebSocket(); // Attempt to reconnect
      };
    }

    function processWeightData(data) {
      const regex = /(\d+\.\d+)/;
      const match = regex.exec(data);
      var label = document.querySelector("label[for='weight']");
      if (match) {
        const weightInLB = parseFloat(parseFloat(match[1]).toFixed(2));
        label.textContent = weightInLB;
      }
    }

    function checkConnectionHealth() {
      var currentTime = Date.now();
      if (currentTime - lastMessageTime > 10000) {
        console.log("No message received for the last 10 seconds. Resetting to default.");
        var label = document.querySelector("label[for='weight']");
        label.textContent = "0";
      }
    }

    connectWebSocket(); // Initial connection
  }

  load_weight_from_websocket();

  function load_websocket_products(data) {
    //console.log('this is data', data);
    var result = JSON.parse(data); // Assuming data is a JSON string
    //console.log('this is result', result)
    var current_url = window.location.href;
    //console.log('this is current url', current_url)
    var parts = current_url.split('/');
    var current_register = parts[parts.length - 1];
    var result_register = result.data.register;
    //console.log('this is urls', current_register, result_register)
    if (result_register == current_register) {
      //console.log(' i must run')
      // DOM elements
      var elements = {
        totalAmt: document.getElementById('amount_total'),
        totalPayable: document.getElementById('total_payable'),
        amountTax: document.getElementById('amount_tax'),
        amountSaving: document.getElementById('amount_saving'),
        customerName: document.getElementById('name'),
        customTable: document.getElementById('customer_section'),
        currentLoyaltyPoint: document.getElementById('customer_loyalty_point'),
        oldLoyaltyPoint: document.getElementById('loyalty_point'),
        mainScreen: document.getElementById('main_screen'),
        paymentMethodScreen: document.getElementById('payment_method_screen'),
        customerSection: document.getElementById('customer_section'),
        productList: document.getElementById('productlist').querySelector('tbody'),
        name: document.getElementById('name'),
        customer_loyalty_point: document.getElementById('customer_loyalty_point'),
        loyalty_point: document.getElementById('loyalty_point')

      };

      // Clear the product list
      elements.productList.innerHTML = '';
      if (result.data.name == "") {
        elements.customTable.style.display = "none"
      }
      else {
        elements.customTable.style.display = "block"
      }
      // Display received data on the UI
      elements.totalAmt.innerHTML = elements.totalPayable.innerHTML = "&#36; 0";
      elements.customerName.innerHTML = result.data.name || '';
      elements.currentLoyaltyPoint.innerHTML = result.data.Current_Loyalty_Point || '';
      elements.oldLoyaltyPoint.innerHTML = result.data.Loyalty_Point || '';
      // elements.customerSection.style.display = result.name ? "block" : "none";
      //console.log('i am inside it', result.data.payment_method)

      // Handle payment screen display
      if (result.data.payment_method !== "" || !result.data || result.data.data.length === 0) {
        elements.mainScreen.style.display = "none";
        elements.paymentMethodScreen.style.display = "block";
        load_payment(data);
      } else {
        elements.mainScreen.style.display = "block";
        elements.paymentMethodScreen.style.display = "none";
      }

      // Calculate and display total savings
      var totalSaving = isNaN(result.data.total_saving) ? 0 : (Math.round(result.data.total_saving * 100) / 100).toString();
      elements.amountSaving.innerHTML = `&#36; ${totalSaving}`;
      var product_total = result.data.data.length;

      // Display product details
      if (result.data && result.data.data && result.data.data.length > 0) {
        //console.log('tihs is product total ==============================', product_total)
        var productTotalElement = document.getElementById('product_total'); // Get the HTML element with id 'product_total'
        productTotalElement.innerHTML = product_total;
        var subtotal = Math.round(result.data.subtotal * 100) / 100;
        var totalAmount = Math.round(result.data.total_amount * 100) / 100;
        var totalTax = Math.round(result.data.total_tax * 100) / 100;

        elements.totalAmt.innerHTML = `&#36; ${subtotal}`;
        elements.totalPayable.innerHTML = `&#36; ${totalAmount}`;
        elements.amountTax.innerHTML = `&#36; ${totalTax}`;

        // Use document fragment to optimize appending
        var fragment = document.createDocumentFragment();
        result.data.data.reverse().forEach(function (product) {
          var row = document.createElement('tr');
          row.innerHTML = `<td>${product.product_name}</td><td>${(Math.round(product.quantity * 100) / 100)}</td><td>&#36; ${(Math.round(product.price * 100) / 100)}</td><td>&#36; ${(Math.round(product.price_display * 100) / 100)}</td>`;
          fragment.appendChild(row);
        });
        elements.productList.appendChild(fragment);
      }
    }
    autoScroll();
  }

  function websocket_load_weight(data) {
    //console.log("loading weight")
    var result = JSON.parse(data); // Assuming data is a JSON string
    var weight = document.getElementById("weight");
    var label = document.querySelector("label[for='weight']");
    label.textContent = result;


  }
