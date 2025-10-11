import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const questionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  subject: z.string().min(1, "Subject is required"),
  grade_level: z.string().optional(),
  coin_reward: z.number().min(0, "Reward must be positive"),
  is_private: z.boolean(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateQuestionDialog = ({ open, onOpenChange }: CreateQuestionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      coin_reward: 0,
      is_private: false,
    },
  });

  const onSubmit = async (data: QuestionFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("questions").insert([{
        user_id: user.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        grade_level: data.grade_level || null,
        coin_reward: data.coin_reward,
        is_private: data.is_private,
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your question has been posted!",
      });

      reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
          <DialogDescription>
            Post your academic question and get help from verified tutors
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., How to solve quadratic equations?"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select onValueChange={(value) => setValue("subject", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Literature">Literature</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="ICT">ICT</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Provide detailed information about your question..."
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="grade_level">Grade Level (Optional)</Label>
            <Input
              id="grade_level"
              {...register("grade_level")}
              placeholder="e.g., Class 10, HSC, SSC"
            />
          </div>

          <div>
            <Label htmlFor="coin_reward">Coin Reward (Optional)</Label>
            <Input
              id="coin_reward"
              type="number"
              {...register("coin_reward", { valueAsNumber: true })}
              placeholder="Offer coins for best answer"
            />
            {errors.coin_reward && (
              <p className="text-sm text-destructive mt-1">{errors.coin_reward.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_private"
              onCheckedChange={(checked) => setValue("is_private", checked)}
            />
            <Label htmlFor="is_private">Make this question private (only visible to you and tutors)</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};