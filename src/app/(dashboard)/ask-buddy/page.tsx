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
        'What are the hospitals located near Sobha Coastline Beach Residences?',
        'What are the registration fees for buying a property in Dubai?',
        'Compare the amenities of Sobha Elwood and Skyvue Solair, focusing on fitness and recreational spaces.',
        'How is Sobha Coastline Beach better than Skyvue Solair in terms of access to healthcare and schools?',
      ]}

      initialHistoryConversationId={historyId}
    />
  );
}
