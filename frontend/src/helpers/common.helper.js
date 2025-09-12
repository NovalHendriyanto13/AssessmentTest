export function aggregateRevenue(invoices, period = "daily") {
  console.log(invoices);
  const map = {};

  invoices.forEach(inv => {
    const date = new Date(inv.date);
    let key;

    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const week = getWeekNumber(date);
        key = `${date.getFullYear()}-W${week}`;
        break;
      case "monthly":
        key = `${date.getFullYear()}-${date.getMonth()+1}`;
        break;
      default:
        key = date.toISOString().split("T")[0];
    }

    const total = inv.revenue
    map[key] = (map[key] || 0) + total;
  });
  
  return Object.entries(map)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a,b) => new Date(a.date) - new Date(b.date));
}

// helper function to get week number
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}
