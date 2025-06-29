import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { User, Volume2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ChatMessage({
  message,
  onSpeak,
  onDelete,
}: {
  message: Message;
  onSpeak: (text: string) => void;
  onDelete: (messageId: string) => void;
}) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "group flex items-end gap-2",
        isUser ? "justify-end" : "justify-start",
        "animate-in fade-in zoom-in-95"
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 border-2 border-primary">
          <AvatarFallback className="bg-primary text-base font-bold text-primary-foreground">
            N
          </AvatarFallback>
        </Avatar>
      )}

      {isUser && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0 rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onDelete(message.id)}
          aria-label="Delete message"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 text-sm shadow-md",
          isUser
            ? "rounded-br-none bg-primary text-primary-foreground"
            : "rounded-bl-none bg-card text-card-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {isAssistant && (
        <div className="flex">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:bg-card"
            onClick={() => onSpeak(message.content)}
            aria-label="Speak message"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isUser && (
        <Avatar className="h-8 w-8 border-2 border-accent">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
