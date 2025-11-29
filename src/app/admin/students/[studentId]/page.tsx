
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter, notFound, useParams } from "next/navigation";
import { recentStudents as initialStudents, type Student } from "@/lib/admin-data";
import StudentProfileClient from "./student-profile-client";
import { useEffect, useState } from "react";
import * as DataStore from "@/lib/data-store";
import type { Transaction, Invoice } from "@/lib/finance-data";


export default function StudentProfilePage() {
    const params = useParams();
    const studentId = params.studentId as string;
    
    const [studentData, setStudentData] = useState<Student | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const allStudents = await DataStore.getStudents();
            const student = allStudents.find((s) => s.id === studentId);
            setStudentData(student);

            const allTransactions = await DataStore.getTransactions();
            setTransactions(allTransactions);

            const allInvoices = await DataStore.getInvoices();
            setInvoices(allInvoices);
            
            setIsLoading(false);
        }
        fetchData();
    }, [studentId]);

    if (isLoading) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
    
    if (!studentData) {
        return notFound();
    }
    
    return <StudentProfileClient student={studentData} transactions={transactions} invoices={invoices} />;
}
