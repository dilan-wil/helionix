'use client'
import { getACollection } from "@/functions/get-a-collection";
import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  balance: number;
  deposits?: number;
  withdrawals?: number;
  plans: { id: string; name: string; price: number; daily: boolean; purchaseDate: string; times: number; lastClicked: string; }[];
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getACollection("users");
        const formattedUsers = allUsers.map((user: any) => ({
          id: user.id,
          name: user.first_name,
          balance: user.balance,
          deposits: user.deposits || 0,
          withdrawals: user.withdrawals || 0,
          plans: user.plans,
        }));
        setUsers(formattedUsers);

        // Calculate totals
        const totalDeposits = formattedUsers.reduce((sum: number, user: User) => sum + (user.deposits || 0), 0);
        const totalWithdrawals = formattedUsers.reduce((sum: number, user: User) => sum + (user.withdrawals || 0), 0);
        const total = totalDeposits - 240000 - 50000 - 21000
        const totalRetrait = totalWithdrawals
        setTotalDeposits(total);
        setTotalWithdrawals(totalRetrait);
        setTotalUsers(formattedUsers.length)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (users.length === 0) {
    return <p>Loading users...</p>;
  }

  return (
    <section className="admin-section section-space">
      <div className="container">
        <div className="header">
          <Link href="/admin/deposits" className="nav-link">Deposits</Link>
          <Link href="/admin/withdrawals" className="nav-link">Withdrawals</Link>
        </div>
        <div className="row justify-content-center">
          <div className="col-xxl-12">
            <div className="section-title-wrapper text-center section-title-space">
              <h2 className="section-title mb-20">Admin - Manage Users</h2>
            </div>
          </div>
        </div>
        <div className="row justify-content-center gy-30">
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
            {/* Display Total Deposits and Withdrawals */}
            <div className="totals">
              <h3>Total Deposits: {totalDeposits}</h3>
              <h3>Total Withdrawals: {totalWithdrawals}</h3>
              <h3>Total Users: {totalUsers}</h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Balance</th>
                  <th>Deposits</th>
                  <th>Withdrawals</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.balance}</td>
                    <td>{user.deposits}</td>
                    <td>{user.withdrawals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
