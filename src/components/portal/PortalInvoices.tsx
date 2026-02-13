import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Receipt } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  description: string | null;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-500/10 text-blue-400',
  paid: 'bg-green-500/10 text-green-400',
  overdue: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-muted text-muted-foreground line-through',
};

interface Props {
  userId: string;
}

export default function PortalInvoices({ userId }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, [userId]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('client_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-16 text-center">
          <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No Invoices</h3>
          <p className="text-muted-foreground font-sans">Your invoices will appear here once generated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="bg-card border-border">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium">{invoice.invoice_number}</span>
                <Badge className={statusStyles[invoice.status] || ''}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
              {invoice.description && (
                <p className="text-sm text-muted-foreground font-sans">{invoice.description}</p>
              )}
              <div className="flex gap-4 text-xs text-muted-foreground font-sans">
                <span>Issued: {format(new Date(invoice.created_at), 'MMM d, yyyy')}</span>
                {invoice.due_date && <span>Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>}
                {invoice.paid_at && <span>Paid: {format(new Date(invoice.paid_at), 'MMM d, yyyy')}</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gold">
                {invoice.currency} {Number(invoice.amount).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
