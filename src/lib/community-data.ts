
export type Club = {
    id: string;
    name: string;
    category: string;
    description: string;
    coverImage: string;
    members: number;
    leader?: {
        name: string;
        avatar: string;
    };
};

export const initialClubs: Club[] = [
    {
        id: "debate-club",
        name: "Debate & Literary Club",
        category: "Academic",
        description: "Sharpen your wit and wisdom. Discussing ideas that shape our world.",
        coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=600&auto=format&fit=crop",
        members: 45,
        leader: { name: "Mr. Okoro", avatar: "https://i.pravatar.cc/40?img=60" }
    },
    {
        id: "jets-club",
        name: "JETS Club",
        category: "STEM",
        description: "Exploring the world of Junior Engineers, Technicians, and Scientists. Innovate and create.",
        coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
        members: 62,
        leader: { name: "Mrs. Chioma", avatar: "https://i.pravatar.cc/40?img=31" }
    },
    {
        id: "press-club",
        name: "Press Club",
        category: "Arts & Media",
        description: "The voice of the school. Reporting on events and stories that matter.",
        coverImage: "https://images.unsplash.com/photo-1455734729978-db1ae4f687fc?q=80&w=600&auto=format&fit=crop",
        members: 28,
        leader: { name: "Ms. Eze", avatar: "https://i.pravatar.cc/40?img=40" }
    },
    {
        id: "art-club",
        name: "Art & Creativity Club",
        category: "Arts & Media",
        description: "Express yourself through painting, sculpture, and digital art.",
        coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
        members: 35,
        leader: { name: "Ms. Eze", avatar: "https://i.pravatar.cc/40?img=40" }
    }
];
