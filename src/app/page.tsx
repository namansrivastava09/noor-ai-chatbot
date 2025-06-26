"use client";

import * as React from "react";
import { Send, User } from "lucide-react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getInitialMessage, sendMessage } from "./actions";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const scrollAreaViewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const initialMessage = await getInitialMessage();
        setMessages([initialMessage]);
      } catch (error) {
        console.error("Error fetching initial message:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Could not start the conversation.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialMessage();
  }, [toast]);

  React.useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop =
        scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const aiMessage = await sendMessage(newMessages);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message.",
      });
      // Revert to previous messages if AI call fails
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center bg-background">
      <div className="flex h-full w-full max-w-2xl flex-col shadow-lg">
        <header className="flex items-center justify-between border-b bg-card p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                N
              </AvatarFallback>
            </Avatar>
            <h1 className="font-headline text-xl font-bold text-foreground">
              Noor
            </h1>
          </div>
        </header>

        <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
          <div className="p-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>

        <div className="border-t bg-card p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full"
              autoComplete="off"
              disabled={isLoading && messages.length > 0}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
