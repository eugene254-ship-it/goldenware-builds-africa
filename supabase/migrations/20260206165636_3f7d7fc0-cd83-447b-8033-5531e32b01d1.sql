
-- Fix: Subscribers UPDATE policy is too permissive (USING true allows anyone to modify any record)
-- Replace with a policy that only allows updates when the correct verification_token is provided
DROP POLICY IF EXISTS "Users can verify/unsubscribe with token" ON public.subscribers;

-- Create a more restrictive update policy: only allow updating if the request includes a matching token
-- This is handled via edge functions, so we restrict direct table updates to admins only
CREATE POLICY "Admins can update subscribers"
ON public.subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
