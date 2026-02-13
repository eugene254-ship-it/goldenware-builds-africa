import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  is_admin: boolean;
  created_at: string;
}

interface Props {
  userId: string;
  selectedProjectId: string | null;
}

export default function PortalMessages({ userId, selectedProjectId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedProjectId) {
      fetchMessages();
      
      // Subscribe to realtime messages
      const channel = supabase
        .channel(`messages-${selectedProjectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'client_messages',
            filter: `project_id=eq.${selectedProjectId}`,
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_messages')
        .select('*')
        .eq('project_id', selectedProjectId!)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedProjectId) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from('client_messages').insert({
        project_id: selectedProjectId,
        sender_id: userId,
        content: newMessage.trim(),
        is_admin: false,
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!selectedProjectId) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground font-sans">Select a project from the Projects tab to view messages.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="h-96 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground font-sans text-sm">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                      msg.sender_id === userId
                        ? 'bg-gold/10 border border-gold/20 text-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {msg.is_admin && msg.sender_id !== userId && (
                      <span className="text-xs font-medium text-gold block mb-1">Goldenware Team</span>
                    )}
                    <p className="text-sm font-sans">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="bg-secondary border-border resize-none min-h-[44px] max-h-32"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              disabled={isSending || !newMessage.trim()}
              className="glow-gold self-end"
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
