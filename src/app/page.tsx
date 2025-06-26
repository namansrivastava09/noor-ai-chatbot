"use client";

import * as React from "react";
import { Send, User, Mic, MicOff } from "lucide-react";

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
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        setIsLoading(true);
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

  React.useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: "Could not recognize your speech. Please try again.",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [toast]);

  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && !isLoading) {
      const synth = window.speechSynthesis;
      if (!synth) {
        console.warn("Speech synthesis not supported in this browser.");
        return;
      }

      const speak = (textToSpeak: string) => {
        if (synth.speaking) {
          synth.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        const setVoiceAndSpeak = () => {
          const voices = synth.getVoices();
          let selectedVoice = voices.find(
            (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male")
          );
          if (!selectedVoice) {
            selectedVoice = voices.find((v) => v.lang.startsWith("en"));
          }
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.rate = 1;
            utterance.pitch = 1;
          }
          synth.speak(utterance);
        };

        if (synth.getVoices().length > 0) {
          setVoiceAndSpeak();
        } else {
          synth.onvoiceschanged = setVoiceAndSpeak;
        }
      };

      speak(lastMessage.content);

      return () => {
        if (synth) {
          synth.cancel();
        }
      };
    }
  }, [messages, isLoading]);

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
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListen = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col items-center bg-background">
      <div className="flex h-full w-full max-w-2xl flex-col sm:shadow-lg">
        <header className="flex items-center justify-between border-b bg-card p-2 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
                N
              </AvatarFallback>
            </Avatar>
            <h1 className="font-headline text-lg font-bold text-foreground sm:text-xl">
              Noor
            </h1>
          </div>
        </header>

        <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
          <div className="space-y-4 p-2 sm:p-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>

        <div className="border-t bg-card p-2 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-1 sm:gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or say something..."
              className="flex-1 rounded-full"
              autoComplete="off"
              disabled={isLoading && messages.length > 0}
            />
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "secondary"}
              className="rounded-full"
              onClick={handleListen}
              disabled={isLoading}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
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
