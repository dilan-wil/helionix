"use client";
import { useState, useEffect } from "react";
import { db } from "@/functions/firebase"; // Import your Firebase instance
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";

const WithdrawalPage = () => {
  const [withdrawals, setWithdrawals] = useState<
    {
      id: string;
      userId?: string;
      gateway?: string;
      amount?: number;
      numero?: number;
      nom?: string;
      a_envoyer?: number;
      charge?: number;
      status?: string;
      date?: string;
    }[]
  >([]);

  useEffect(() => {
    // Fetch withdrawals from Firestore
    const fetchWithdrawals = async () => {
      const withdrawalsCollectionRef = collection(db, "withdrawals");
      const snapshot = await getDocs(withdrawalsCollectionRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWithdrawals(data);
    };

    fetchWithdrawals();
  }, []);

  const handleUpdateStatus = async (w: any) => {
    // Update withdrawal status to 'success' in Firestore
    const withdrawalRef = doc(db, "withdrawals", w.id);
    await updateDoc(withdrawalRef, { status: "success" });

    // Update the corresponding transaction status in the user's subcollection
    const transactionsCollectionRef = doc(
      db,
      "users",
      w.userId,
      "transactions",
      w.id
    );
    await updateDoc(transactionsCollectionRef, { status: "success" });

    // Update the local state to reflect the change
    setWithdrawals(
      withdrawals.map((item) =>
        item.id === w.id ? { ...item, status: "success" } : item
      )
    );
  };

  const handleRefuseStatus = async (w: any) => {
    // Update withdrawal status to 'failed' in Firestore
    const withdrawalRef = doc(db, "withdrawals", w.id);
    await updateDoc(withdrawalRef, { status: "failed" });

    // Update the corresponding transaction status in the user's subcollection
    const transactionsCollectionRef = doc(
      db,
      "users",
      w.userId,
      "transactions",
      w.id
    );
    await updateDoc(transactionsCollectionRef, { status: "failed" });

    // Update the local state to reflect the change
    setWithdrawals(
      withdrawals.map((item) =>
        item.id === w.id ? { ...item, status: "failed" } : item
      )
    );
  };

  // Filter withdrawals to only include those with "pending" status
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");

  return (
    <div>
      <h1>Withdrawal</h1>
      <ul>
        {pendingWithdrawals.map((w: any) => (
          <div key={w.id}>
            <li>
              <table>
                <tbody>
                  <tr>
                    <td>UserId: {w.userId}    &nbsp; &nbsp;</td>
                    <td>  Gateway: {w.gateway}</td>
                  </tr>
                  <tr>
                    <td>Amount: {w.amount}</td>
                    <td>Numero:{w.numero}</td>
                    <td>Nom: {w.nom}</td>
                  </tr>
                  <tr>
                    <td>Charge: {w.charge}</td>
                    <td>Total à envoyer: {w.a_envoyer}</td>
                  </tr>
                  <tr>
                    <td>Status: {w.status}</td>
                    <td>Date: {w.date}</td>
                  </tr>
                </tbody>
              </table>
              <div>
                <button onClick={() => handleUpdateStatus(w)}>
                  Mark as Success
                </button>&nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={() => handleRefuseStatus(w)}>
                  Refuse
                </button>
              </div>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default WithdrawalPage;
