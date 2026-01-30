"use client";
import { useCallback, useRef, useState } from "react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

type UseSpeechRecognitionOptions = {
  lang?: string;
  interim?: boolean;
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (message: string) => void;
};

type SpeechControls = {
  isListening: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
};

const PHRASE_HINTS = [
  "Sobha", "Sobha Realty", "Sobha One", "Sobha Creek Vistas", "Sobha Hartland",
  "Dubai", "Downtown Dubai", "Business Bay", "Palm Jumeirah", "JVC",
  "Creek Harbour", "Azizi", "Ellington", "Emaar", "Damac",
  "Reidin", "DLD", "RERA", "rental yield", "ROI",
  "floor plan", "unit plan", "unit availability", "resale", "primary sale",
  "developer sale", "PSF", "AED per sq.ft", "freehold", "leasehold",
  "handover", "off-plan", "ready", "unit mix", "1 bed plus study",
  "2 bed plus study", "3 bed plus study", "1 bed", "2 bed",
  "3 bed", "4 bed", "5 bed", "duplex", "penthouse", "townhouse",
  "villa", "apartment", "service charge", "DLD fee",
  "average rental", "market trend"
];

function normalizeSttText(raw: string): string {
  let text = raw || "";

  text = text.replace(/\bFY\s*([0-9][0-9\s]{0,4})\b/gi, (_match, rawDigits: string) => {
    const digits = (rawDigits || "").replace(/\s+/g, "");

    if (!digits) return "FY";

    let suffix: string;

    if (digits.length <= 2) {
      suffix = digits;
    } else if (digits.length === 3 && digits[1] === "0") {
      suffix = digits[0] + digits[2];
    } else {
      suffix = digits.slice(-2);
    }

    return `FY${suffix}`;
  });

  text = text.replace(/\b(Soba|Sofa|Sobah|Sobhaa|Subha)\b/gi, "Sobha");
  text = text.replace(/\b(Sobha Realty|Sobha realty)\b/gi, "Sobha Realty");

  const trimmed = text.trim();
  if (trimmed.length > 0 && trimmed.length % 2 === 0) {
    const mid = trimmed.length / 2;
    const first = trimmed.slice(0, mid).trim();
    const second = trimmed.slice(mid).trim();
    if (first && first === second) {
      return first;
    }
  }

  return trimmed;
}

async function getAzureSpeechToken() {
  const cached = sessionStorage.getItem("azure-speech-token");
  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() < data.expiry) {
      return { token: data.token, region: data.region };
    }
  }

  const res = await fetch("/api/speech-token");
  const data = await res.json();

  if (!data.token || !data.region) {
    throw new Error("Failed to get speech token");
  }

  sessionStorage.setItem("azure-speech-token", JSON.stringify({
    token: data.token,
    region: data.region,
    expiry: Date.now() + 540000
  }));

  return { token: data.token, region: data.region };
}

export function useSpeechRecognition(opts: UseSpeechRecognitionOptions = {}): SpeechControls {
  const { lang = "en-IN", onInterim, onFinal, onError } = opts;

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<speechsdk.SpeechRecognizer | null>(null);
  const transcriptRef = useRef<string>("");

  const cleanup = useCallback(() => {
    const recognizer = recognitionRef.current;
    if (recognizer) {
      try { recognizer.close(); } catch { }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    if (recognitionRef.current) return;

    try {
      const { token, region } = await getAzureSpeechToken();

      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = lang;
      speechConfig.setProperty(
        speechsdk.PropertyId.SpeechServiceResponse_PostProcessingOption,
        "TrueText"
      );

      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      const phraseList = speechsdk.PhraseListGrammar.fromRecognizer(recognizer);
      PHRASE_HINTS.forEach(p => phraseList.addPhrase(p));

      transcriptRef.current = "";

      recognizer.recognizing = (_s: any, e: any) => {
        if (e?.result?.text) {
          onInterim?.(transcriptRef.current + e.result.text);
        }
      };

      recognizer.recognized = (_s: any, e: any) => {
        if (e?.result?.reason === speechsdk.ResultReason.RecognizedSpeech && e.result.text) {
          transcriptRef.current += (transcriptRef.current ? " " : "") + e.result.text;
          const normalized = normalizeSttText(transcriptRef.current);
          transcriptRef.current = normalized;
          onFinal?.(normalized);
        }
      };

      recognizer.canceled = (_s: any, e: any) => {
        if (e?.errorDetails) {
          onError?.(e.errorDetails);
        }
        if (transcriptRef.current) {
          const normalized = normalizeSttText(transcriptRef.current);
          onFinal?.(normalized);
        }
        cleanup();
      };

      recognizer.sessionStopped = () => {
        if (transcriptRef.current) {
          const normalized = normalizeSttText(transcriptRef.current);
          onFinal?.(normalized);
        }
        cleanup();
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          recognitionRef.current = recognizer;
          setIsListening(true);
        },
        (_err: any) => {
          onError?.("Failed to start microphone");
          cleanup();
        }
      );
    } catch (error: any) {
      onError?.(error?.message || "Speech recognition error");
      setIsListening(false);
    }
  }, [lang, onError, onInterim, cleanup]);

  const stop = useCallback(() => {
    const recognizer = recognitionRef.current;
    if (!recognizer) return;

    recognizer.stopContinuousRecognitionAsync(
      () => cleanup(),
      () => cleanup()
    );
  }, [cleanup]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { isListening, start, stop, toggle };
}
