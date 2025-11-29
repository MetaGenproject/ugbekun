
"use client";

import * as DataStore from "@/lib/data-store";
import StaffProfileClient from "./staff-profile-client";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Staff } from "@/lib/hr-data";
import type { Transaction } from "@/lib/finance-data";

export default function StaffProfilePage() {
    const params = useParams();
    const staffId = params.staffId as string;

    const [staff, setStaff] = useState<Staff | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!staffId) return;
            const allStaff = await DataStore.getStaff();
            const staffMember = allStaff.find(s => s.id === staffId);
            setStaff(staffMember);

            const allTransactions = await DataStore.getTransactions();
            setTransactions(allTransactions);
            
            setIsLoading(false);
        }
        fetchData();
    }, [staffId]);
    
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!staff) {
        return notFound();
    }

    return <StaffProfileClient staff={staff} transactions={transactions} />;
}

    