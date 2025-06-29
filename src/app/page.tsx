"use client";

import * as React from "react";
import { Send, User, Mic, MicOff, Volume2, History } from "lucide-react";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  getWelcomeMessage,
  getInitialMessage,
  sendMessage,
  getChatHistory,
} from "./actions";

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
  const [historyLoaded, setHistoryLoaded] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [lastSubmissionMethod, setLastSubmissionMethod] = React.useState<
    "text" | "voice" | null
  >(null);

  const { toast } = useToast();
  const scrollAreaViewportRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    const fetchWelcomeMessage = async () => {
      setIsLoading(true);
      try {
        const welcomeMessage = await getWelcomeMessage();
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error("Error fetching welcome message:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Could not start the conversation.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchWelcomeMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop =
        scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (!chatContainer || !window.visualViewport) return;

    const resizeHandler = () => {
      chatContainer.style.height = `${window.visualViewport.height}px`;
    };

    window.visualViewport.addEventListener("resize", resizeHandler);
    resizeHandler();

    return () => {
      window.visualViewport.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const speak = React.useCallback((textToSpeak: string) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

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
  }, []);

  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      !isLoading &&
      lastSubmissionMethod === "voice"
    ) {
      speak(lastMessage.content);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [messages, isLoading, lastSubmissionMethod, speak]);

  const processUserMessage = React.useCallback(
    async (content: string, method: "text" | "voice") => {
      if (!content || isLoading) return;

      setLastSubmissionMethod(method);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content,
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      if (method === "text") setInput("");
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
        setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, toast]
  );

  const handleLoadHistory = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let history = await getChatHistory();
      if (history.length > 0) {
        setMessages(history);
      } else {
        // First time ever loading history and it's empty
        const initialMessage = await getInitialMessage();
        setMessages([initialMessage]);
        toast({
          title: "Welcome!",
          description: "This is the beginning of your conversation.",
        });
      }
      setHistoryLoaded(true);
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not load the conversation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      setInput(transcript); // Keep input updated visually
      setIsListening(false);
      processUserMessage(transcript, "voice");
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
  }, [toast, processUserMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await processUserMessage(input.trim(), "text");
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
    <div
      id="chat-container"
      className="flex w-full flex-col items-center bg-background"
    >
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
            {!historyLoaded && messages.length > 0 && !isLoading && (
              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadHistory}
                  disabled={isLoading}
                >
                  <History className="mr-2 h-4 w-4" />
                  Load Conversation
                </Button>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onSpeak={speak} />
            ))}
            {isLoading && messages.length > 0 && <TypingIndicator />}
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
