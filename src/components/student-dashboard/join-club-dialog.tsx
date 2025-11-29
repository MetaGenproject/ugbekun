
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle } from "lucide-react";
import type { Club } from "@/lib/community-data";

type JoinClubDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    allClubs: Club[];
    joinedClubIds: string[];
    onJoinClub: (clubId: string) => void;
};

export function JoinClubDialog({ isOpen, onClose, allClubs, joinedClubIds, onJoinClub }: JoinClubDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const availableClubs = useMemo(() => allClubs.filter(club => 
    !joinedClubIds.includes(club.id) &&
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [allClubs, joinedClubIds, searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Join a Club or Society</DialogTitle>
          <DialogDescription>
            Search for a club and click to join.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Input 
                placeholder="Search available clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <ScrollArea className="h-72">
            <div className="space-y-3 pr-4">
                {availableClubs.map(club => (
                    <div key={club.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                         <Avatar className="h-10 w-10">
                            {club.leader && <AvatarImage src={club.leader.avatar} />}
                            <AvatarFallback>{club.name.slice(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{club.name}</p>
                            <p className="text-xs text-muted-foreground">Led by {club.leader?.name}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { onJoinClub(club.id); onClose(); }}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Join
                        </Button>
                    </div>
                ))}
                {availableClubs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No other clubs available.</p>
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
