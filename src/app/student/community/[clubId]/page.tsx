

"use client";

import * as DataStore from "@/lib/data-store";
import ClubDetailsClient from "./club-details-client";
import { notFound, useParams } from 'next/navigation';
import { type Club } from "@/lib/community-data";
import { useEffect, useState } from "react";

export default function ClubDetailsPage() {
    const params = useParams();
    const clubId = params.clubId as string;
    const [club, setClub] = useState<Club | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClub = async () => {
            const clubs = await DataStore.getClubs();
            setClub(clubs.find(c => c.id === clubId));
            setIsLoading(false);
        };
        fetchClub();
    }, [clubId]);

    if (isLoading) {
        return <div>Loading club details...</div>;
    }

    if (!club) {
        return notFound();
    }
    
    return <ClubDetailsClient club={club} />;
}
