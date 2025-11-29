
"use client";

import { Suspense } from "react";
import { useMemo, useEffect, useState } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { type Contact, initialAdminConversations, parentContacts as initialParentContacts } from "@/lib/chat-data";
import { type Student, recentStudents as initialStudents } from "@/lib/admin-data";
import type { Conversation } from "@/lib/chat-data";

function MessagesPageContent() {
    const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
    const [students] = useLocalStorage<Student[]>("students", initialStudents);
    const [conversations] = useLocalStorage<Conversation>('admin-conversations', initialAdminConversations);
    
    const staffContacts: Contact[] = useMemo(() => staff.map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        role: s.department === 'Academics' ? 'Teacher' : 'Admin',
        online: Math.random() > 0.5,
    })), [staff]);

    const studentContacts: Contact[] = useMemo(() => students.map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        role: 'Student',
        online: Math.random() > 0.3,
    })), [students]);

    const allContacts = [...initialParentContacts, ...staffContacts, ...studentContacts];

    return (
        <ChatLayout
            currentUserRole="admin"
            contacts={allContacts}
            initialConversations={conversations}
            conversationStorageKey="admin-conversations"
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

    