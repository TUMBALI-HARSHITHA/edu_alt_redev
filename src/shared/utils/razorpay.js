function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
async function createRazorpayOrder(amount) {
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create order" }));
    throw new Error(err.error || `Server error (${res.status})`);
  }
  return res.json();
}
async function verifyPayment(orderId, paymentId, signature) {
  const res = await fetch("/api/verifyPayment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    })
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}
function openRazorpayCheckout(options) {
  const rzp = new window.Razorpay(options);
  rzp.open();
}
export {
  createRazorpayOrder,
  loadRazorpayScript,
  openRazorpayCheckout,
  verifyPayment
};
