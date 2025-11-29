
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendMessageToStudent } from "@/ai/flows/admin-actions";
import { Loader2, Send } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Conversation } from "@/lib/chat-data";
import { initialAdminConversations } from "@/lib/chat-data";

type SendMessageDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
};

export function SendMessageDialog({ isOpen, onClose, studentId, studentName }: SendMessageDialogProps) {
    const [messageText, setMessageText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();
    const [conversations, setConversations] = useLocalStorage<Conversation>('admin-conversations', initialAdminConversations);

    const handleSend = async () => {
        if (!messageText.trim()) return;
        setIsSending(true);
        try {
            const result = await sendMessageToStudent({ studentId, messageText, conversations });
            setConversations(result.updatedConversations);
            toast({
                variant: "success",
                title: "Message Sent",
                description: `Your message has been sent to ${studentName}.`,
            });
            setMessageText("");
            onClose();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not send the message. Please try again.",
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send Message to {studentName}</DialogTitle>
                    <DialogDescription>
                        This will send a direct message to the student and their linked guardians.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea 
                        placeholder={`Type your message to ${studentName}...`}
                        rows={5}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSend} disabled={isSending || !messageText.trim()}>
                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isSending ? "Sending..." : "Send Message"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
