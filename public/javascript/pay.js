/* eslint-disable */
console.log("Hello");
const amount = document.getElementById("rzp-button").value;
console.log(amount);
document.getElementById("rzp-button").onclick = async function (e) {
  e.preventDefault();
  const hospId = e.target.dataset.myid;
  console.log("Hello :--");
  console.log(hospId);
  let response = await fetch(`http://localhost:3000/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
    }),
  });
  let orderData = await response.json();

  var options = {
    key: "rzp_test_FMCCYhAfIQ7C1z",
    amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Acme Corp",
    description: "Test Transaction",
    order_id: `${orderData.order.id}`,
    image: "https://example.com/your_logo",

    handler: async function (response) {
      const data = {
        razorpay_payment_id: response.razorpay_payment_id,
        order_id: response.razorpay_order_id,
        signature: response.razorpay_signature,
        amount,
        hospId,
      };
      console.log(data);
      let generated = await fetch(`http://localhost:3000/pay/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });

      let res = await generated.json();

      if (res.success == true) {
        let data_status = await fetch(`http://localhost:3000/pay/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
          }),
        });
      } else {
      }
    },
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
};
