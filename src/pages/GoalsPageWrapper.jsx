import React from "react";
import GoalsPage from "../components/Goals/GoalsPage";

export default function GoalsPageWrapper({ user }) {
  const [transactions, setTransactions] = React.useState([]);
  React.useEffect(() => {
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, [user]);
  return <GoalsPage transactions={transactions} />;
}
