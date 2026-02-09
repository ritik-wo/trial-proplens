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
        'Which is the least selling unit type in Vincitore Dolce Vita?',
        'Can you compare the average price per sq feet in Burj Khalifa and Bukadra?',
        'Among off-plan sales in Q2 2025, what % of units sold were 2 beds or larger?',
        "How many units were sold by Danube last year and what's the total sales amount?",
      ]}

      mode="market-transaction"
      marketName="uae"
      transactionType="default-transaction"
      initialHistoryConversationId={historyId}
    />
  );
}
