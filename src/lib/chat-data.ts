

export type Role = "Teacher" | "Parent" | "Admin" | "Student";

export type Contact = {
    id: string;
    name: string;
    avatar: string;
    role: Role;
    online: boolean;
};

export type Message = {
    id: string;
    from: "me" | "other";
    text: string;
    timestamp: string;
}

export type Conversation = Record<string, Message[]>;

export const parentContacts: Contact[] = [
    { id: "parent-001", name: "David Okon's Parent", avatar: "https://i.pravatar.cc/40?img=50", role: "Parent", online: true }
];

export const initialAdminConversations: Conversation = {
    "stf-001": [
        { id: 'msg-1', from: "other", text: "Good morning, Nabila. Just a heads up that the budget report for Q3 is ready for your review.", timestamp: "10:30 AM" },
        { id: 'msg-2', from: "me", text: "Thanks, Mr. Adebayo. I'll take a look this afternoon.", timestamp: "10:31 AM" },
    ],
    "parent-001": [
         { id: 'msg-3', from: "other", text: "Hello, I am having trouble with the fee payment portal. Can you assist?", timestamp: "Yesterday" }
    ],
    "UC-AB-2024": [] // Empty conversation with a student
};

export const initialTeacherConversations: Conversation = {
    "UC-AB-2024": [
        { id: 'msg-4', from: "other", text: "Good morning Mr. Adebayo. I have a question about the assignment.", timestamp: "10:30 AM" },
        { id: 'msg-5', from: "me", text: "Good morning Alex. Of course, what's your question?", timestamp: "10:31 AM" },
    ],
    "parent-001": [
         { id: 'msg-6', from: "other", text: "Hello, I'd like to schedule a meeting to discuss David's progress.", timestamp: "Yesterday" }
    ]
};

export const initialStudentConversations: Conversation = {
    "stf-001": [
        { id: 'msg-7', from: 'me', text: 'Good morning sir, please can you explain the last part of the trigonometry assignment?', timestamp: '9:01 AM' },
        { id: 'msg-8', from: 'other', text: 'Good morning Alex. Please refer to the supplementary video I linked in the resources tab. Let me know if it\'s still unclear.', timestamp: '9:05 AM'},
    ],
     "stf-002": [],
};

export const initialParentConversations: Conversation = {
     "stf-001": [
        { id: 'msg-9', from: 'me', text: 'Good afternoon, Mr. Adebayo. I noticed Maya had some trouble with her last math quiz. Can we discuss?', timestamp: '2:15 PM' },
    ],
    "stf-002": [],
};
