let chart;

function renderChart(data) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        label: "₦ Amount",
        data: [data.income, data.expenses],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 8
      }]
    },
    options: {
      animation: {
        duration: 800
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: { color: "#fff" }
        },
        x: {
          ticks: { color: "#fff" }
        }
      }
    }
  });
}