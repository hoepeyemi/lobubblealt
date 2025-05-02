import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { AuthService } from "~/server/services/AuthService";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  addToWaitlist: publicProcedure
    .input(z.object({ contact: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let isEmail = false;
      if (input.contact.includes("@")) {
        isEmail = true;
      }
      const user = await ctx.db.waitlist.create({
        data: {
          contact: input.contact,
          name: input.name,
          isEmail,
        },
      });
      return user;
    }),
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        phone: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.email && !input.phone) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either email or phone is required"
          });
        }
        
        // Ensure input values are not empty strings
        const sanitizedInput = {
          email: input.email && input.email.trim() !== "" ? input.email : undefined,
          phone: input.phone && input.phone.trim() !== "" ? input.phone : undefined,
          firstName: input.firstName,
          lastName: input.lastName,
        };
        
        // Additional validation - must have at least one contact method
        if (!sanitizedInput.email && !sanitizedInput.phone) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Either email or phone is required"
          });
        }
        
        // Check if user already exists
        if (sanitizedInput.email) {
          const existingUser = await ctx.db.user.findUnique({
            where: { email: sanitizedInput.email },
          });
          
          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A user with this email already exists"
            });
          }
        }
        
        if (sanitizedInput.phone) {
          const existingUser = await ctx.db.user.findUnique({
            where: { phone: sanitizedInput.phone },
          });
          
          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A user with this phone number already exists"
            });
          }
        }
        
        // Create the user
        const user = await ctx.db.user.create({
          data: {
            email: sanitizedInput.email,
            phone: sanitizedInput.phone,
            firstName: sanitizedInput.firstName,
            lastName: sanitizedInput.lastName,
          },
        });
        
        return user;
      } catch (error) {
        // Handle Prisma errors more specifically
        if (error instanceof TRPCError) {
          throw error; // Re-throw TRPC errors
        }
        
        console.error("User registration error:", error);
        
        // Handle database connection errors
        if (error instanceof Error && 
            (error.message.includes('connect') || 
             error.message.includes('database') || 
             error.message.includes('prisma'))) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection error. Please try again later.",
            cause: error
          });
        }
        
        // Generic error fallback
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user account",
          cause: error
        });
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
        otp: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isEmail = input.identifier.includes('@');
      
      // Find the user
      const user = await ctx.db.user.findUnique({
        where: isEmail ? { email: input.identifier } : { phone: input.identifier },
      });
      
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found"
        });
      }
      
      // Verify the OTP
      const authService = new AuthService(ctx.db);
      const isOtpValid = await authService.verifyOtp(user.id, input.otp);
      
      if (!isOtpValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired OTP"
        });
      }
      
      // Return the user for the client to store in its state
      return user;
    }),
  requestOtp: publicProcedure
    .input(
      z.object({
        identifier: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isEmail = input.identifier.includes('@');
      
      // Find user by identifier
      const user = await ctx.db.user.findUnique({
        where: isEmail ? { email: input.identifier } : { phone: input.identifier },
      });
      
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please register first."
        });
      }
      
      // Generate OTP
      const isDev = process.env.NODE_ENV === 'development';
      const otp = isDev ? "000000" : Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP
      const authService = new AuthService(ctx.db);
      await authService.createOtp(user.id, otp);
      
      // In a real implementation, you would send the OTP via email or SMS here
      // For now, just return it in development mode
      
      return isDev ? { success: true, otp } : { success: true };
    }),
  updateUserProfile: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...updateData } = input;
      
      // Update user profile
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: updateData,
      });
      
      return updatedUser;
    }),
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      return user;
    }),
  getUserByPhone: publicProcedure
    .input(z.object({ phone: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { phone: input.phone },
      });
      return user;
    }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });
      return user;
    }),
});
