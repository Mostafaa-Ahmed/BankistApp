const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306, 2500, -642.21, -133, 79, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Mostafa Ahmed",
  movements: [5000, 700, -150, -900, -3210, -1000, 9000000, -30],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Yara Nady",
  movements: [5000, 200, 150, 790, 3210, 1050, 8500, 30],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = "";
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${Math.abs(mov)}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayMovements = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummry = (acc) => {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${income}€`;
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
console.log(creatUserName(accounts));

const updateUi = function (acc) {
  displayMovements(acc.movements);
  calcDisplayMovements(acc);
  calcDisplaySummry(acc);
};
//
// EventHandlee //
//
let currnentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currnentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currnentAccount);
  if (currnentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back , ${
      currnentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUi(currnentAccount);
  } else {
    labelWelcome.textContent = "Try Again";
  }
});
//
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveracc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, reciveracc);
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    reciveracc &&
    currnentAccount.balance >= amount &&
    reciveracc?.username !== currnentAccount.username
  ) {
    currnentAccount.movements.push(-amount);
    reciveracc.movements.push(amount);
    updateUi(currnentAccount);
  }
});
//
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  inputLoanAmount.value = "";
  if (loan > 0 && currnentAccount.movements.some((mov) => mov >= loan * 0.1)) {
    currnentAccount.movements.push(loan);
    updateUi(currnentAccount);
  }
});
//
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currnentAccount.username &&
    Number(inputClosePin.value) === currnentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currnentAccount.username
    );
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    console.log("delet");
  }
});
//
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currnentAccount.movements, !sorted);
  sorted = !sorted;
});
