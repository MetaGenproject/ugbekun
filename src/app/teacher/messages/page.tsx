"use client";

import { useMemo, Suspense } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { type Student, recentStudents as initialStudents } from "@/lib/admin-data";
import { type Contact, initialTeacherConversations, parentContacts } from "@/lib/chat-data";

function MessagesPageContent() {
    const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
    const [students] = useLocalStorage<Student[]>('students', initialStudents);

    // Get staff contacts (excluding self)
    const staffContacts: Contact[] = useMemo(() => staff.filter(s => s.id !== 'stf-001').map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        role: 'Admin',
        online: Math.random() > 0.5,
    })), [staff]);

    // Get student contacts for the teacher's classes
    const myClasses = useMemo(() => staff.find(s => s.id === 'stf-001')?.assignedClasses.map(c => c.class) || [], [staff]);
    const studentContacts: Contact[] = useMemo(() => students.filter(s => myClasses.includes(s.class)).map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        role: 'Student',
        online: Math.random() > 0.3,
    })), [students, myClasses]);

    const allContacts = [...staffContacts, ...studentContacts, ...parentContacts];

    return (
       <ChatLayout 
        currentUserRole="teacher"
        contacts={allContacts}
        initialConversations={initialTeacherConversations}
        conversationStorageKey="teacher-conversations"
       />
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div>Loading messages...</div>}>
            <MessagesPageContent />
        </Suspense>
    )
}
