
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Loader2, User, Shield, GraduationCap, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact, Message, Conversation, Role } from "@/lib/chat-data";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";

const roleIcons: Record<Role, React.ReactNode> = {
    Teacher: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
    Parent: <User className="h-4 w-4 text-muted-foreground" />,
    Admin: <Shield className="h-4 w-4 text-muted-foreground" />,
    Student: <User className="h-4 w-4 text-muted-foreground" />,
}

type ChatLayoutProps = {
    currentUserRole: "admin" | "teacher" | "student" | "parent";
    contacts: Contact[];
    initialConversations: Conversation;
    conversationStorageKey: string;
};

export function ChatLayout({ currentUserRole, contacts, initialConversations, conversationStorageKey }: ChatLayoutProps) {
    const searchParams = useSearchParams();
    const defaultContactId = searchParams.get('contactId');
    
    const [searchTerm, setSearchTerm] = useState("");
    const [conversations, setConversations] = useLocalStorage<Conversation>(conversationStorageKey, initialConversations);
    
    const filteredContacts = useMemo(() => contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contacts, searchTerm]);

    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [conversations, selectedContact]);

    useEffect(() => {
        if (defaultContactId) {
            const contactToSelect = contacts.find(c => c.id === defaultContactId);
            if (contactToSelect) {
                setSelectedContact(contactToSelect);
            }
        } else if (!selectedContact && filteredContacts.length > 0 && window.innerWidth >= 768) {
            setSelectedContact(filteredContacts[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultContactId, contacts]);

    useEffect(() => {
        if (!selectedContact && filteredContacts.length > 0) {
            if (window.innerWidth >= 768) { // md breakpoint
                setSelectedContact(filteredContacts[0]);
            }
        } else if (selectedContact && !filteredContacts.some(c => c.id === selectedContact.id)) {
             if (window.innerWidth >= 768) {
                setSelectedContact(filteredContacts[0] || null);
            } else {
                setSelectedContact(null);
            }
        }
    }, [filteredContacts, selectedContact]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedContact) return;

        setIsSending(true);

        const message: Message = {
            id: `msg-${Date.now()}`,
            from: 'me',
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTimeout(() => {
            setConversations(prev => {
                const newConversations = { ...prev };
                const currentMessages = newConversations[selectedContact.id] || [];
                newConversations[selectedContact.id] = [...currentMessages, message];
                return newConversations;
            });
            setNewMessage("");
            setIsSending(false);
            
             // Simulate a reply
            setTimeout(() => {
                let replyText = "Acknowledged. Thank you.";
                 if (selectedContact.role === 'Parent') {
                    replyText = currentUserRole === 'teacher' 
                        ? "Thank you for reaching out. I will look into this and get back to you shortly."
                        : "Thank you for the message. We will address this promptly.";
                 } else if (selectedContact.role === 'Student') {
                    replyText = "Noted. Thanks for letting me know. I'll take a look.";
                 } else if (selectedContact.role === 'Teacher') {
                    replyText = "Thanks, Mr. Adebayo. I'll take a look this afternoon."
                 }
                 
                 const reply: Message = {
                    id: `msg-${Date.now() + 1}`,
                    from: 'other',
                    text: replyText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                 setConversations(prev => {
                    const newConversations = { ...prev };
                    const currentMessages = newConversations[selectedContact.id] || [];
                    newConversations[selectedContact.id] = [...currentMessages, reply];
                    return newConversations;
                });
            }, 1500)

        }, 500);
    };

    const currentMessages = selectedContact ? conversations[selectedContact.id] || [] : [];
    
    return (
        <Card className="h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex overflow-hidden relative">
            {/* Contact List Panel */}
            <div className={cn("w-full md:w-1/3 border-r flex flex-col transition-transform duration-300 ease-in-out", selectedContact && "hidden md:flex")}>
                 <div className="p-4 border-b">
                    <Input 
                        placeholder="Search contacts..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea>
                    <div className="p-2 space-y-1">
                    {filteredContacts.map(contact => (
                        <button key={contact.id} onClick={() => setSelectedContact(contact)} className="w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 relative hover:bg-muted">
                             {selectedContact?.id === contact.id && (
                                <motion.div layoutId="active-chat-pill" className="absolute inset-0 bg-secondary rounded-lg" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                             )}
                            <Avatar className="h-10 w-10 relative z-10">
                                <AvatarImage src={contact.avatar} />
                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                {contact.online && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background"></div>}
                            </Avatar>
                            <div className="flex-1 min-w-0 z-10">
                                <p className="font-medium truncate">{contact.name}</p>
                                <div className="flex items-center gap-1.5">
                                    {roleIcons[contact.role]}
                                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                    </div>
                </ScrollArea>
            </div>
            
            {/* Main Chat Panel (Desktop) */}
            <div className="w-2/3 hidden md:flex flex-col">
                {selectedContact ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                             <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedContact.avatar} />
                                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{selectedContact.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedContact.online ? "Online" : "Offline"}</p>
                            </div>
                        </div>
                        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                            <div className="space-y-6">
                                {currentMessages.map((msg) => (
                                    <div key={msg.id} className={cn("flex items-end gap-2", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                                         {msg.from === 'other' && <Avatar className="h-8 w-8"><AvatarImage src={selectedContact.avatar}/><AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback></Avatar>}
                                        <div className={cn("max-w-md rounded-2xl p-3 text-sm", msg.from === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                                            {msg.text}
                                            <div className={cn("text-xs mt-1.5", msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground/80')}>{msg.timestamp}</div>
                                        </div>
                                    </div>
                                ))}
                                 {currentMessages.length === 0 && (
                                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                                        <p className="font-medium">No messages yet.</p>
                                        <p className="text-xs">Your conversation with {selectedContact.name} will appear here.</p>
                                     </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                             <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                                <Input 
                                    placeholder="Type a message..." 
                                    className="pr-24 rounded-full h-12"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={isSending}
                                />
                                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" type="button"><Paperclip className="h-5 w-5" /></Button>
                                    <Button size="icon" className="h-9 w-9 rounded-full" type="submit" disabled={isSending || !newMessage.trim()}>
                                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Select a conversation to start messaging.</div>
                )}
            </div>

            {/* Mobile Chat Panel Overlay */}
            <AnimatePresence>
            {selectedContact && (
                <motion.div 
                    key={selectedContact.id}
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-background md:hidden flex flex-col"
                >
                    <div className="p-2 border-b flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedContact(null)}><ArrowLeft/></Button>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={selectedContact.avatar} />
                            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{selectedContact.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedContact.online ? "Online" : "Offline"}</p>
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {currentMessages.map((msg) => (
                                <div key={msg.id} className={cn("flex items-end gap-2", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                                        {msg.from === 'other' && <Avatar className="h-8 w-8"><AvatarImage src={selectedContact.avatar}/><AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback></Avatar>}
                                    <div className={cn("max-w-xs rounded-2xl p-3 text-sm", msg.from === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                                        {msg.text}
                                        <div className={cn("text-xs mt-1.5", msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground/80')}>{msg.timestamp}</div>
                                    </div>
                                </div>
                            ))}
                                {currentMessages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                    <p className="font-medium">No messages yet.</p>
                                    <p className="text-xs">Your conversation with {selectedContact.name} will appear here.</p>
                                    </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-2 border-t">
                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                            <Input 
                                placeholder="Type a message..." 
                                className="pr-24 rounded-full h-12"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={isSending}
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" type="button"><Paperclip className="h-5 w-5" /></Button>
                                <Button size="icon" className="h-9 w-9 rounded-full" type="submit" disabled={isSending || !newMessage.trim()}>
                                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </Card>
    );
}
