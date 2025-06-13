import React from "react";
import ReportsPage from "../components/Reports/ReportsPage";

export default function ReportsPageWrapper({ user }) {
  const [transactions, setTransactions] = React.useState([]);
  React.useEffect(() => {
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, [user]);
  return <ReportsPage transactions={transactions} />;
}
