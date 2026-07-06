import { PageHeader } from "@/components/ui/page-header";
import { MessagesSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="">
      <PageHeader
        title="Messages"
        description="Your conversations and direct messages"
      />

      <div className="flex flex-col items-center justify-center rounded-xl border border-border-glass bg-surface-dark py-20">
        <MessagesSquare className="mb-3 h-12 w-12 text-text-secondary" />
        <p className="text-lg font-medium text-text-primary">No messages yet</p>
        <p className="mt-1 text-sm text-text-secondary">
          Messaging will be available soon
        </p>
      </div>
    </div>
  );
}
