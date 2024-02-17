const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});
// Orders.forEach((order) => {
//   const tr = document.createElement("tr");
//   const trContent = `<tr>
// <td>${order.productName}</td>
// <td>${order.productNumber}</td>
// <td>${order.paymentStatus}</td>
// <td>${order.paymentStatus}</td>
// <td>${order.paymentStatus}</td>

// <td class="${
//     order.shipping === "Declined"
//       ? "danger"
//       : order.shipping === "pending"
//       ? "warning"
//       : "primary"
//   }">${order.shipping}</td>
// <td class="primary">Details</td>
// <td><button class="danger modelbutt" onclick="openModal()">Edit coupon</button></td>
// </tr>`;
//   tr.innerHTML = trContent;
//   document.querySelector("table tbody").appendChild(tr);
// });

//  Modal popup js

var modal = document.getElementById("myModal");

// Open the modal
function openModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

// Close the modal
function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// Close the modal when the user clicks outside of it
window.onclick = function (event) {
  var modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// The add coupon model -------------------------------------------------------------------
var cmodal = document.getElementById("addCouponModal");

// Open the modal
function openCModal() {
  var cmodal = document.getElementById("addCouponModal");
  cmodal.style.display = "block";
}

// Close the modal
function closeCModal() {
  var cmodal = document.getElementById("addCouponModal");
  cmodal.style.display = "none";
}

// Close the modal when the user clicks outside of it
window.onclick = function (event) {
  var cmodal = document.getElementById("addCouponModal");
  if (event.target == cmodal) {
    cmodal.style.display = "none";
  }
};

function validateDatas() {
  var numCodes = document.getElementById("numCodes").value;
  var redemptionLimit = document.getElementById("redemptionLimit").value;
  var format = document.getElementById("format").value;
  var customPrefix = document.getElementById("customPrefix").value;
  var applicableTo = document.getElementById("applicableTo").value;
  var discountType = document.getElementById("discountType").value;
  var discount_number = document.getElementById("discount_number").value;
  var maxDiscountAmount = document.getElementById("maxDiscountAmount").value;
  var length = document.getElementById("length").value;
  var conditions = document.getElementById("condition").value;
  var expiry = document.getElementById("expiry").value;

  // const obje = {
  //   numCodes,
  //   redemptionLimit,
  //   // format,
  //   customPrefix,
  //   // applicableTo,
  //   // discountType,
  //   discount_number,
  //   maxDiscountAmount,
  //   length,
  //   conditions,
  //   expiry,
  // };

  console.log(numCodes);
  console.log(redemptionLimit);
  console.log(format);
  console.log(customPrefix);
  console.log(applicableTo);
  console.log(discountType);
  console.log(discount_number);
  console.log(maxDiscountAmount);
  console.log(length);
  console.log(conditions);
  console.log(expiry);

  if (
    numCodes != "" &&
    redemptionLimit != "" &&
    customPrefix != "" &&
    discount_number != "" &&
    maxDiscountAmount != "" &&
    length != "" &&
    conditions != "" &&
    expiry != ""
  ) {
    return true;
  } else {
    console.log("Fill all the fields");
    var cmodal = document.getElementById("addCouponModal");
    cmodal.style.display = "block";
    return false;
  }
}
