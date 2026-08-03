"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Incomes, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [editIncome, setEditIncome] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalIncome: sql`COALESCE(SUM(${Incomes.amount}::numeric), 0)`.mapWith(Number), // FIXED ERROR
        totalSpend: sql`COALESCE(SUM(${Expenses.amount}::numeric), 0)`.mapWith(Number), // FIXED ERROR
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));

    setIncomelist(result);
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes refreshData={getIncomelist} />
        {incomelist?.length > 0
          ? incomelist.map((income, index) => (
              <div key={index} className="relative">
                <IncomeItem budget={income} />
                <CreateIncomes
                  refreshData={getIncomelist}
                  editIncome={income}
                />
              </div>
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
