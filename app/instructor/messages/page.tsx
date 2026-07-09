import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { MessagesSquare } from "lucide-react";

export default function InstructorMessagesPage() {
  return (
    <div>
      <PageHeader
        title="Messages"
        description="Conversations with your students"
      />
      <GlassCard>
        <div className="flex flex-col items-center py-16 text-center">
          <MessagesSquare className="mb-3 h-10 w-10 text-text-tertiary" />
          <p className="text-sm text-text-tertiary">Messaging will be available when the conversations endpoint is connected.</p>
        </div>
      </GlassCard>
    </div>
  );
}
