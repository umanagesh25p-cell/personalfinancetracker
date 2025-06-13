import React from "react";
import BudgetPage from "../components/Budget/BudgetPage";

export default function BudgetPageWrapper({ user }) {
  const [transactions, setTransactions] = React.useState([]);
  React.useEffect(() => {
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, [user]);
  return <BudgetPage transactions={transactions} />;
}
