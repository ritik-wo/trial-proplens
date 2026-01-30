"use client";
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatPage } from '@/components/blocks/ChatPage';

export default function AskBuddy() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get('historyId') ?? undefined;

  return (
    <ChatPage
      title="Welcome,"
      description="I am your smart buddy for data and insights. How can I help you today?"
      welcomePlaceholder="What's the unit availability at Sobha One? Give me the handover date."
      bottomPlaceholder="Ask anything"
      thinkingIntro="Understanding your query"
      thinkingMid="Looking up information for you"
      suggestedQuestions={[
        'Give me units in Sobha One with 1200 sq ft area & price under 3M AED.',
        "What's the price range and psf range for 2-bed units in Sobha Hartland II?",
        "How is Sobha One better than Emaar Beachfront for investment?",
        "What's the unit availability at Sobha SeaHaven? Give me the payment plan.",
      ]}

      initialHistoryConversationId={historyId}
    />
  );
}
