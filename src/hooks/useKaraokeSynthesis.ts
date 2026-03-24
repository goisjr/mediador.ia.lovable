import { useState, useRef, useCallback } from 'react';

export const useKaraokeSynthesis = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakWithHighlight = useCallback((text: string, lang = 'pt-BR') => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utteranceRef.current = utterance;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const textUpToChar = text.substring(0, charIndex);
        const wordCount = textUpToChar.split(' ').length - 1;
        setCurrentWordIndex(wordCount);
      }
    };

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setCurrentWordIndex(-1);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setCurrentWordIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentWordIndex(-1);
  }, []);

  return { speakWithHighlight, cancel, currentWordIndex, speaking };
};
