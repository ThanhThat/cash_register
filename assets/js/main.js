(() => {
  const priceElem = document.getElementById("price");
  const cashElem = document.getElementById("cash");
  const resultElem = document.querySelector(".result");

  const cashInDrawerList = document.querySelectorAll(".cash-in-drawer");
  if (!cashInDrawerList || !priceElem || !cashElem || !resultElem) return;

  const cidInitial = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
  ];

  const cashRegister = document.getElementById("cash-register");
  if (!cashRegister) return;

  cashRegister.addEventListener("submit", (e) => {
    e.preventDefault();

    cashInDrawerList.forEach((elem, i) => {
      let currencyValue = Number(elem.value);
      if (isNaN(currencyValue)) {
        alert("Please enter a valid number!");
        return;
      }

      cidInitial[i][1] = currencyValue;
    });

    console.log(cidInitial);

    let price = Number(priceElem.value);
    let cash = Number(cashElem.value);

    if (isNaN(price) || isNaN(cash)) {
      alert("Please enter a valid number!");
      return;
    }

    const result = checkCashRegister(price, cash, cidInitial);
    console.log(result);

    const status = result.status;
    // const change = result.change;
    let changeStr = "";
    result.change.forEach((item, i) => {
      changeStr += `<div>${item[0]}: ${item[1]}$</div>`;
    });

    console.log(changeStr);

    resultElem.innerHTML = `<h2>RESULT</h2><h3 style="Color: red; margin-top: 2rem">Status:</h3></div> ${status}</div>
       <h3 style="Color: red; margin-top: 2rem"> Change:</h3><div> ${changeStr};</div>
      `;
  });
})();

const checkCashRegister = (price, cash, cid) => {
  // create an object to store the result
  const result = { status: "", change: [] };

  // Calculate the total cash in drawer
  let totalCID = cid.reduce((acc, curr) => acc + curr[1], 0);
  totalCID = Math.round(totalCID * 100) / 100;

  // copy cid to avoid changing angular data
  const cidCopy = JSON.parse(JSON.stringify(cid));

  // Calculate the change due
  let changDue = cash - price;

  // If the change due is greater than the total cash in drawer, return INSUFFICIENT_FUNDS
  if (changDue > totalCID) {
    result.status = "INSUFFICIENT_FUNDS";
    return result;
  }

  // If the chang due is equal to the total cash in drawer, return CLOSED
  if (changDue === totalCID) {
    result.status = "CLOSED";
    result.change = cid;
    return result;
  }

  // Create an array to store the available denominations and their values
  const currencyValues = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.1,
    QUARTER: 0.25,
    ONE: 1,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    "ONE HUNDRED": 100,
  };
  // create an array to store the change;
  const change = [];

  // reverse arr cid to go from highest to first
  cidCopy.reverse();

  for (let i = 0; i < cidCopy.length; i++) {
    let currency = cidCopy[i][0];
    let currencyTotal = cidCopy[i][1];
    let currencyValue = currencyValues[currency];
    let currencyAmount = 0;

    while (changDue >= currencyValue && currencyTotal > 0) {
      currencyTotal -= currencyValue;
      changDue -= currencyValue;
      changDue = Math.round(changDue * 100) / 100; // Round to 2 decimal places
      currencyAmount += currencyValue;
    }

    if (currencyAmount > 0) {
      change.push([currency, currencyAmount]);
    }
  }

  if (changDue > 0) {
    result.status = "INSUFFICIENT_FUNDS";
    return result;
  } else {
    result.status = "OPEN";
    result.change = change;
    return result;
  }
};
