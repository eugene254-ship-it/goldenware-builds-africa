
-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Client Projects table
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  service_type TEXT,
  location TEXT,
  budget_estimate NUMERIC,
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own projects"
ON public.client_projects FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Admins can manage all projects"
ON public.client_projects FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Client Documents table
CREATE TABLE public.client_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.client_projects(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view documents"
ON public.client_documents FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.client_projects WHERE id = project_id AND client_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage documents"
ON public.client_documents FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can upload documents to their projects"
ON public.client_documents FOR INSERT
WITH CHECK (
  auth.uid() = uploaded_by
  AND EXISTS (SELECT 1 FROM public.client_projects WHERE id = project_id AND client_id = auth.uid())
);

-- Client Invoices table
CREATE TABLE public.client_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.client_projects(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their invoices"
ON public.client_invoices FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.client_projects WHERE id = project_id AND client_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage invoices"
ON public.client_invoices FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Client Messages table
CREATE TABLE public.client_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.client_projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view messages"
ON public.client_messages FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.client_projects WHERE id = project_id AND client_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can send messages on their projects"
ON public.client_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND (
    EXISTS (SELECT 1 FROM public.client_projects WHERE id = project_id AND client_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Admins can manage messages"
ON public.client_messages FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages;

-- Add updated_at triggers
CREATE TRIGGER update_client_projects_updated_at
BEFORE UPDATE ON public.client_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_invoices_updated_at
BEFORE UPDATE ON public.client_invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for client documents
INSERT INTO storage.buckets (id, name, public) VALUES ('client-documents', 'client-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view their project documents storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload to client documents storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage client document storage"
ON storage.objects FOR ALL
USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));
