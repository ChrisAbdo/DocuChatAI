import { UseChatHelpers } from "ai/react";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import { EnterIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@/components/ui/button";
// import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChatInput({
  onSubmit,
  handleSubmit,
  handleInputChange,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="fixed w-1/2 inset-x-1/2 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:border-t sm:px-12">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.refresh();
              router.push("/");
            }}
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
            )}
          >
            <PlusIcon />
            <span className="sr-only">New Chat</span>
          </button>

          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            //   @ts-ignore
            onChange={handleInputChange}
            placeholder="Send a message."
            spellCheck={false}
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          />
          <div className="absolute right-0 top-4 sm:right-4">
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || input === ""}
            >
              <EnterIcon />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
