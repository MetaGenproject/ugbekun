"use client";

import { useMemo, Suspense } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { type Contact, initialStudentConversations } from "@/lib/chat-data";

function MessagesPageContent() {
    const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);

    const contacts: Contact[] = useMemo(() => staff.map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        role: s.department === 'Academics' ? 'Teacher' : 'Admin',
        online: Math.random() > 0.5,
    })), [staff]);

    return (
       <ChatLayout 
        currentUserRole="student"
        contacts={contacts}
        initialConversations={initialStudentConversations}
        conversationStorageKey="student-conversations"
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
