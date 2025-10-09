-- Add work_type column to work_requests table
ALTER TABLE public.work_requests 
ADD COLUMN work_type text;

-- Add payment_status and payment_amount columns for payment tracking
ALTER TABLE public.work_requests 
ADD COLUMN payment_status text DEFAULT 'pending',
ADD COLUMN payment_amount numeric(10,2);