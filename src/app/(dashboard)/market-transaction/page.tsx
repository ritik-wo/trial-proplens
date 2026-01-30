"use client";
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatPage } from '@/components/blocks/ChatPage';

export default function MarketTransaction() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get('historyId') ?? undefined;

  return (
    <ChatPage
      title="Transaction Data"
      description="Query and analyze new sale, resales and rental transaction data across property types."
      welcomePlaceholder="What's the avg price psf sold in Business Bay vs Downtown Dubai?"
      bottomPlaceholder="Ask any market transaction question"
      thinkingIntro="Understanding your transaction query"
      thinkingMid="Reviewing market transaction data for you"
      suggestedQuestions={[
        'What is the avg price per sq ft for off-plan sales in Downtown Dubai in 2024?',
        'Which area had the most villa sales in the last 3 months?',
        "Give sales trends for Palm Jumeirah. What's the median PSF?",
        "What's the avg rental yield in JVC for 1-bed apartments?",
      ]}

      mode="market-transaction"
      marketName="dubai"
      transactionType="default-transaction"
      initialHistoryConversationId={historyId}
    />
  );
}
