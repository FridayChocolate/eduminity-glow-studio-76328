import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const contributorSignupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  university: z.string().min(2, "Please select a university"),
  sscResults: z.string().min(1, "SSC results are required"),
  hscResults: z.string().min(1, "HSC results are required"),
  semester: z.string().min(1, "Please select a semester"),
  year: z.string().min(4, "Please select a year"),
});

type ContributorSignupFormData = z.infer<typeof contributorSignupSchema>;

interface ContributorSignupFormProps {
  onSuccess: () => void;
}

const universities = [
  "Dhaka University",
  "BUET",
  "Chittagong University",
  "Rajshahi University",
  "Jahangirnagar University",
  "Bangladesh University of Engineering and Technology",
  "North South University",
  "BRAC University",
  "Independent University, Bangladesh",
  "American International University-Bangladesh",
];

export const ContributorSignupForm = ({ onSuccess }: ContributorSignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContributorSignupFormData>({
    resolver: zodResolver(contributorSignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      university: "",
      sscResults: "",
      hscResults: "",
      semester: "",
      year: "",
    },
  });

  const onSubmit = async (data: ContributorSignupFormData) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Assign contributor role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: "contributor" });

      if (roleError) {
        toast({
          title: "Role assignment failed",
          description: roleError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create contributor profile
      const { error: profileError } = await supabase
        .from("contributor_profiles")
        .insert({
          user_id: authData.user.id,
          university: data.university,
          ssc_results: data.sscResults,
          hsc_results: data.hscResults,
          semester: data.semester,
          year: data.year,
          verification_status: "pending",
        });

      if (profileError) {
        toast({
          title: "Profile creation failed",
          description: profileError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Eduminity!",
          description: "Your contributor account is under review.",
        });
        onSuccess();
      }
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Rafiul Hasan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sscResults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSC GPA</FormLabel>
                <FormControl>
                  <Input placeholder="5.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hscResults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSC GPA</FormLabel>
                <FormControl>
                  <Input placeholder="5.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Semester</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        Semester {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                      <SelectItem key={year} value={`${year}`}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up as Contributor
        </Button>
      </form>
    </Form>
  );
};
