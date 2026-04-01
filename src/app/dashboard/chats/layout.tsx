import { ChatList } from '@/widgets/dashboard-chat/ui/ChatList';

export default function DashboardChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-surface-900">
        <ChatList />
      </div>
      <div>{children}</div>
    </div>
  );
}
