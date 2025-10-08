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
  userType: z.enum(["university", "college", "highschool", "businessman"], {
    required_error: "Please select your profile type",
  }),
  university: z.string().optional(),
  institution: z.string().optional(),
  sscResults: z.string().optional(),
  hscResults: z.string().optional(),
  semester: z.string().optional(),
  year: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
}).refine((data) => {
  if (data.userType === "university") {
    return data.university && data.sscResults && data.hscResults && data.semester && data.year;
  }
  if (data.userType === "college") {
    return data.institution && data.sscResults && data.semester && data.year;
  }
  if (data.userType === "highschool") {
    return data.institution && data.year;
  }
  if (data.userType === "businessman") {
    return data.businessName && data.businessType;
  }
  return true;
}, {
  message: "Please complete all required fields for your profile type",
});

type ContributorSignupFormData = z.infer<typeof contributorSignupSchema>;

interface ContributorSignupFormProps {
  onSuccess: () => void;
}

const universities = [
  "Dhaka University",
  "BUET (Bangladesh University of Engineering and Technology)",
  "Chittagong University",
  "Rajshahi University",
  "Jahangirnagar University",
  "North South University",
  "BRAC University",
  "Independent University, Bangladesh (IUB)",
  "American International University-Bangladesh (AIUB)",
  "East West University",
  "United International University (UIU)",
  "ULAB (University of Liberal Arts Bangladesh)",
  "Daffodil International University",
  "Ahsanullah University of Science and Technology",
  "Bangladesh Agricultural University",
  "Shahjalal University of Science and Technology",
  "Islamic University, Bangladesh",
  "Comilla University",
  "Noakhali Science and Technology University",
  "Khulna University",
  "Begum Rokeya University",
  "Bangabandhu Sheikh Mujibur Rahman Science and Technology University",
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
      userType: undefined,
      university: "",
      institution: "",
      sscResults: "",
      hscResults: "",
      semester: "",
      year: "",
      businessName: "",
      businessType: "",
    },
  });

  const userType = form.watch("userType");

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

      // Create contributor profile with conditional data
      const profileData: any = {
        user_id: authData.user.id,
        verification_status: "pending",
      };

      if (data.userType === "university") {
        profileData.university = data.university;
        profileData.ssc_results = data.sscResults;
        profileData.hsc_results = data.hscResults;
        profileData.semester = data.semester;
        profileData.year = data.year;
      } else if (data.userType === "college") {
        profileData.university = data.institution;
        profileData.ssc_results = data.sscResults;
        profileData.hsc_results = "-";
        profileData.semester = data.semester;
        profileData.year = data.year;
      } else if (data.userType === "highschool") {
        profileData.university = data.institution;
        profileData.ssc_results = "-";
        profileData.hsc_results = "-";
        profileData.semester = "-";
        profileData.year = data.year;
      } else if (data.userType === "businessman") {
        profileData.business_name = data.businessName;
        profileData.business_type = data.businessType;
        profileData.university = "-";
        profileData.ssc_results = "-";
        profileData.hsc_results = "-";
        profileData.semester = "-";
        profileData.year = "-";
      }

      const { error: profileError } = await supabase
        .from("contributor_profiles")
        .insert(profileData);

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
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your profile type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="university">University Student</SelectItem>
                  <SelectItem value="college">College Student</SelectItem>
                  <SelectItem value="highschool">High School Student</SelectItem>
                  <SelectItem value="businessman">Businessman</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {userType === "university" && (
          <>
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
          </>
        )}

        {userType === "college" && (
          <>
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your college name" {...field} />
                  </FormControl>
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
                        {[...Array(6)].map((_, i) => (
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
            </div>

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
          </>
        )}

        {userType === "highschool" && (
          <>
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>High School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your high school name" {...field} />
                  </FormControl>
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
          </>
        )}

        {userType === "businessman" && (
          <>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}


        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up as Contributor
        </Button>
      </form>
    </Form>
  );
};
