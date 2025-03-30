import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import { insertRsvpSchema, type InsertRsvp } from "@shared/schema";

export default function RSVPForm() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertRsvp>({
    resolver: zodResolver(insertRsvpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      certification: "PMP",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertRsvp) => {
      return apiRequest("POST", "/api/rsvp", data);
    },
    onSuccess: async () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit RSVP. Please try again.",
      });
    },
  });

  const onSubmit = (data: InsertRsvp) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl font-bold text-center">PMP/CAPM Review RSVP</CardTitle>
          <CardDescription className="text-center text-primary-foreground/90">
            Free review session for Boston University students
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {isSuccess ? (
            <div className="mt-4">
              <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Thank you for your RSVP!</p>
                  <p className="mt-1">
                    We have recorded your registration for the review session.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Please complete this form to reserve your spot in our upcoming PMP or CAPM review session.
                  This event is exclusively for Boston University students.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boston University Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="username@bu.edu" 
                            type="email"
                          />
                        </FormControl>
                        <FormDescription>
                          Must be a valid @bu.edu email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which certification interests you?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="PMP" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                PMP
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="CAPM" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                CAPM
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="Both" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Both
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Submitting..." : "Submit RSVP"}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>

      <footer className="mt-6 text-sm text-gray-500 text-center">
        <p>© Boston University. All rights reserved.</p>
      </footer>
    </div>
  );
}
