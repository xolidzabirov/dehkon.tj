import { ChatConversation } from '@/widgets/dashboard-chat/ui/ChatConversation';

export default async function DashboardChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return <ChatConversation chatId={chatId} />;
}
