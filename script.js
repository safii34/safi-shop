const amount = document.getElementById("amount");
const price = document.getElementById("price");
const payment = document.getElementById("payment");
const paymentNumber = document.getElementById("paymentNumber");
const receipt = document.getElementById("receipt");
const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const form = document.getElementById("orderForm");
const message = document.getElementById("message");

function updatePrice(){
  const option = amount.options[amount.selectedIndex];
  price.value = `${option.dataset.price} AFN`;
}
amount.addEventListener("change", updatePrice);

payment.addEventListener("change", () => {
  if(payment.value === "HesabPay"){
    paymentNumber.innerHTML = 'HesabPay: <b>0796345081</b>';
  } else {
    paymentNumber.innerHTML = 'Atoma: <b>0793801363</b>';
  }
});

receipt.addEventListener("change", () => {
  const file = receipt.files[0];
  if(!file){ preview.classList.add("hidden"); return; }

  if(file.size > 5 * 1024 * 1024){
    receipt.value = "";
    preview.classList.add("hidden");
    showMessage("حجم رسید نباید بیشتر از 5MB باشد.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

function showMessage(text, type){
  message.textContent = text;
  message.className = `message ${type}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const playerId = document.getElementById("playerId").value.trim();
  const file = receipt.files[0];

  if(!/^[0-9]{5,30}$/.test(playerId)){
    showMessage("لطفاً Player ID معتبر وارد کنید.", "error");
    return;
  }

  if(!file){
    showMessage("لطفاً تصویر رسید پرداخت را انتخاب کنید.", "error");
    return;
  }

  const selectedAmount = amount.value;
  const selectedPrice = price.value;
  const selectedPayment = payment.value;

  // این نسخه فقط فرم سمت کاربر است؛ برای ذخیره واقعی Order
  // باید یک backend/API یا سرویس فرم به آن متصل شود.
  const orderId = "SAFI-" + Date.now().toString().slice(-8);

  showMessage(
    `سفارش ${orderId} ثبت شد. مقدار: ${selectedAmount} UC | قیمت: ${selectedPrice} | Player ID: ${playerId} | پرداخت: ${selectedPayment}.`,
    "success"
  );

  console.log({
    orderId,
    ucType: "PUBG Mobile",
    amount: selectedAmount + " UC",
    price: selectedPrice,
    playerId,
    payment: selectedPayment,
    receiptName: file.name
  });
});
