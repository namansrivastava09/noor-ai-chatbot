import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 justify-start animate-in fade-in">
      <Avatar className="h-8 w-8 border-2 border-primary">
        <AvatarFallback className="bg-primary text-base font-bold text-primary-foreground">
          N
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[75%] rounded-lg rounded-bl-none p-3 shadow-md bg-card">
        <div className="flex items-center justify-center gap-1.5 h-5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
