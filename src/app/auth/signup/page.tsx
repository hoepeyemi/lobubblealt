"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowRight, Key, Mail, Phone, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { ClientTRPCErrorHandler, parsePhoneNumber } from "~/lib/utils";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required",
  path: ["email"],
});

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [identifier, setIdentifier] = useState("");
  
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const registerUser = api.users.registerUser.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  const requestOtp = api.users.requestOtp.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  const loginMutation = api.users.login.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  const handleSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // Ensure we have either email or phone
      if (!values.email && !values.phone) {
        toast.error("Email or phone is required");
        return;
      }
      
      // Format phone number if provided, but ensure it's properly formatted
      const formattedValues = {
        ...values,
        phone: values.phone ? parsePhoneNumber(values.phone) : undefined,
        email: values.email || undefined // Make sure email is undefined if empty string
      };
      
      // Make sure we have at least one identifier (email or phone)
      if (!formattedValues.email && !formattedValues.phone) {
        toast.error("Email or phone is required");
        return;
      }
      
      // Log the formatted values for debugging
      console.log("Registration payload:", formattedValues);
      
      // Register the user
      const user = await registerUser.mutateAsync(formattedValues);

      if (!user || !user.id) {
        throw new Error("Failed to create user account");
      }

      // Store user ID and identifier for OTP verification
      setUserId(user.id);
      const userIdentifier = values.email || values.phone;
      if (!userIdentifier) {
        throw new Error("Email or phone is required");
      }
      
      // Format and store the identifier
      const formattedIdentifier = values.phone 
        ? parsePhoneNumber(values.phone)
        : values.email;
      
      if (!formattedIdentifier) {
        throw new Error("Invalid contact information");
      }
      
      setIdentifier(formattedIdentifier);

      // Request OTP
      const response = await requestOtp.mutateAsync({
        identifier: formattedIdentifier,
      });

      // In development, show the OTP in a toast
      if (process.env.NODE_ENV === 'development' && response.otp) {
        toast.success(`Development OTP: ${response.otp}`);
      }

      toast.success("Account created! Please verify with OTP code");
      setShowOtp(true);
    } catch (error) {
      // More detailed error handling
      let errorMessage = "Failed to create account";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = String(error);
      }
      
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter a valid OTP code");
      return;
    }

    setIsLoading(true);
    try {
      // Use the login procedure to verify the OTP
      await loginMutation.mutateAsync({
        identifier,
        otp: otpCode,
      });

      toast.success("Account verified successfully!");
      router.push("/auth/signin");
    } catch (error) {
      toast.error("Failed to verify OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign up for a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtp ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="email@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        At least one contact method (email or phone) is required
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Enter OTP Code
                </label>
                <div>
                  <Input 
                    placeholder="Enter 6-digit code" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  We sent a verification code to your {identifier.includes('@') ? 'email' : 'phone'}
                </p>
              </div>
              
              <Button 
                onClick={handleVerifyOtp} 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
                <Key className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => router.push("/auth/signin")}
            >
              Sign in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 