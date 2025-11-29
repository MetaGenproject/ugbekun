
"use client";

import { useMemo, Suspense } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { type Contact, initialParentConversations } from "@/lib/chat-data";

function MessagesPageContent() {
    const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
    
    const staffContacts: Contact[] = useMemo(() => staff.filter(s => s.department === 'Academics').map(s => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        role: 'Teacher',
        online: Math.random() > 0.5,
    })), [staff]);

    return (
        <ChatLayout
            currentUserRole="parent"
            contacts={staffContacts}
            initialConversations={initialParentConversations}
            conversationStorageKey="parent-conversations"
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
