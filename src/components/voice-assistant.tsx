'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Mic, MicOff, Languages, X, Loader2, Volume2, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { voiceAssistant } from '@/ai/flows/voice-assistant-flow';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'mr-IN'>('en-US');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const recognitionRef = useRef<any | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, 'user');
        handleSend(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({ variant: 'destructive', title: 'Speech Recognition Error', description: event.error });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Audio element for playback
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);

    return () => {
        recognitionRef.current?.stop();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.lang = language;
    }
  }, [language]);
  
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender }]);
  };

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
       if (!recognitionRef.current) {
            toast({ variant: 'destructive', title: 'Browser Not Supported', description: 'Speech recognition is not supported in this browser.' });
            return;
        }
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };
  
  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    try {
      const response = await voiceAssistant({ query: text, language });
      addMessage(response.text, 'bot');
      if (audioRef.current) {
        audioRef.current.src = response.audio;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Voice assistant error:', error);
      toast({ variant: 'destructive', title: 'AI Error', description: 'Could not get a response from the assistant.' });
      addMessage("Sorry, I'm having trouble right now.", 'bot');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addMessage(inputText, 'user');
      handleSend(inputText);
      setInputText('');
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <Bot className="h-7 w-7" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Agri Mita</SheetTitle>
        </SheetHeader>
        <div className="flex items-center gap-2 py-2">
            <Languages className="h-5 w-5 text-muted-foreground" />
             <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="hi-IN">Hindi</SelectItem>
                    <SelectItem value="mr-IN">Marathi</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <ScrollArea className="flex-1 pr-4 -mr-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'bot' && (
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Bot className="h-5 w-5" />
                    </div>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-4 py-2 text-sm',
                    message.sender === 'user'
                      ? 'bg-muted'
                      : 'bg-primary/10'
                  )}
                >
                  {message.text}
                </div>
                 {message.sender === 'user' && (
                    <div className="bg-muted rounded-full p-2">
                        <User className="h-5 w-5" />
                    </div>
                )}
              </div>
            ))}
            {isListening && (
                <div className="flex justify-center items-center gap-2 text-muted-foreground animate-pulse">
                    <Mic className="h-4 w-4" /> Listening...
                </div>
            )}
             {isProcessing && (
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
            )}
             {isPlaying && (
                <div className="flex justify-center items-center gap-2 text-muted-foreground animate-pulse">
                    <Volume2 className="h-4 w-4" /> Speaking...
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 space-y-4">
           <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
            <Input 
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing || isPlaying || isListening}
            />
            <Button type="submit" size="icon" disabled={isProcessing || isPlaying || isListening}>
              <Send className="h-5 w-5"/>
            </Button>
          </form>
          <div className="flex items-center justify-center">
            <Button
              size="icon"
              className="h-16 w-16 rounded-full"
              onClick={handleToggleListening}
              disabled={isProcessing || isPlaying}
              variant={isListening ? 'destructive' : 'default'}
            >
              {isListening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
