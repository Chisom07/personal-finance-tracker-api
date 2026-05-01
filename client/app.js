const API = "https://personal-finance-tracker-api-a97c.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const logout = () => {
  localStorage.removeItem("token");
  location.href = "index.html";
};

const login = async () => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    location.href = "dashboard.html";
  } else {
    alert("Login failed");
  }
};

const register = async () => {
  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  alert("Account created. Please login.");
};

const fetchSummary = async () => {
  const res = await fetch(`${API}/summary?month=2026-05`, {
    headers: { Authorization: "Bearer " + getToken() }
  });

  const data = await res.json();

  income.innerText = "₦" + data.income.toFixed(2);
  expenses.innerText = "₦" + data.expenses.toFixed(2);
  balance.innerText = "₦" + data.balance.toFixed(2);

  renderChart(data);
};

const fetchTransactions = async () => {
  const res = await fetch(`${API}/transactions`, {
    headers: { Authorization: "Bearer " + getToken() }
  });

  const data = await res.json();

  table.innerHTML = data.map(t => `
    <tr class="fade-in">
      <td>${t.category}</td>
      <td>₦${t.amount}</td>
      <td>${t.type}</td>
    </tr>
  `).join("");
};

const addTransaction = async () => {
  await fetch(`${API}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify({
      amount: amount.value,
      type: type.value,
      category: category.value,
      description: description.value,
      date: new Date().toISOString()
    })
  });

  fetchSummary();
  fetchTransactions();
};

if (window.location.pathname.includes("dashboard")) {
  fetchSummary();
  fetchTransactions();
}