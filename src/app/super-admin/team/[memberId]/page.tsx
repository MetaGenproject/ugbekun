

"use client";

import * as DataStore from "@/lib/data-store";
import TeamMemberProfileClient from "./team-member-profile-client";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TeamMember } from "@/lib/team-data";

export default function TeamMemberProfilePage() {
    const params = useParams();
    const memberId = params.memberId as string;

    const [member, setMember] = useState<TeamMember | undefined>(undefined);
    const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const team = await DataStore.getInternalTeam();
            setAllTeamMembers(team);
            setMember(team.find(m => m.id === memberId));
            setIsLoading(false);
        };
        fetchData();
    }, [memberId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!member) {
        return notFound();
    }
    
    return <TeamMemberProfileClient member={member} allTeamMembers={allTeamMembers} />;
}
