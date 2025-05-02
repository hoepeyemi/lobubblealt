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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Key, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "~/providers/auth-provider";
import { ClientTRPCErrorHandler, parsePhoneNumber } from "~/lib/utils";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export default function SignIn() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  
  const { login } = useAuth();

  // Use the user.requestOtp procedure to request an OTP
  const requestOtp = api.users.requestOtp.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  // Use the user.login procedure to verify the OTP and login
  const loginMutation = api.users.login.useMutation({
    onError: ClientTRPCErrorHandler,
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const handleRequestOtp = async () => {
    setIsLoading(true);
    try {
      let currentIdentifier;
      if (authMethod === "email") {
        const result = await emailForm.trigger();
        if (!result) {
          setIsLoading(false);
          return;
        }
        currentIdentifier = emailForm.getValues().email;
      } else {
        const result = await phoneForm.trigger();
        if (!result) {
          setIsLoading(false);
          return;
        }
        currentIdentifier = parsePhoneNumber(phoneForm.getValues().phone);
      }

      setIdentifier(currentIdentifier);

      // Request OTP via API
      const response = await requestOtp.mutateAsync({
        identifier: currentIdentifier,
      });
      
      if (response.success) {
        toast.success(`OTP sent to your ${authMethod}. Please check and enter the code.`);
        
        // In development, show the OTP in a toast
        if (process.env.NODE_ENV === 'development' && response.otp) {
          toast.success(`Development OTP: ${response.otp}`);
        }
        
        setShowOtpInput(true);
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
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
      const result = await loginMutation.mutateAsync({
        identifier,
        otp: otpCode,
      });

      // Call login method from auth provider
      await login(identifier);
      
      // Success message
      toast.success("Authentication successful");
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Sign in to your account using your email or phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtpInput ? (
            <Tabs defaultValue="email" onValueChange={(value) => setAuthMethod(value as "email" | "phone")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(handleRequestOtp)} className="space-y-4 pt-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="phone">
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(handleRequestOtp)} className="space-y-4 pt-4">
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 pt-4">
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
                  We sent a verification code to your {authMethod}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!showOtpInput ? (
            <Button 
              onClick={handleRequestOtp} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send verification code"}
              <Key className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleVerifyOtp} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowOtpInput(false)}
                disabled={isLoading}
              >
                Back
              </Button>
            </>
          )}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account?</span>{" "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => router.push("/auth/signup")}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 