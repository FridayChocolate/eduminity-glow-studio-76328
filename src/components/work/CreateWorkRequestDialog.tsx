import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const workRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.string().optional(),
  subject: z.string().optional(),
  deadline: z.string().optional(),
});

type WorkRequestFormData = z.infer<typeof workRequestSchema>;

interface CreateWorkRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateWorkRequestDialog = ({ open, onOpenChange }: CreateWorkRequestDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WorkRequestFormData>({
    resolver: zodResolver(workRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      subject: "",
      deadline: "",
    },
  });

  const onSubmit = async (data: WorkRequestFormData) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a work request",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("work_requests").insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      budget: data.budget,
      subject: data.subject,
      deadline: data.deadline,
      status: "open",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your work request has been posted!",
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["work-requests"] });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Post a Work Request</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Need help with Physics assignment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the work you need done..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ৳500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Physics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Request
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
