import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AnyClientTypes } from "@trpc/server/unstable-core-do-not-import";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string, silence = false) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Copied to clipboard");
    })
    .catch(() => {
      if (!silence) {
        toast.error("Failed to copy to clipboard");
      }
    });
}

export function generateQrCode(data: string): string {
  const size = "200x200";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`;
}

export function ClientTRPCErrorHandler<T extends AnyClientTypes>(
  x?: TRPCClientErrorLike<T>,
) {
  if (x?.message) {
    toast.error(x?.message);
  } else if ((x?.data as { code: string })?.code === "INTERNAL_SERVER_ERROR") {
    toast.error("We are facing some issues. Please try again later");
  } else if ((x?.data as { code: string })?.code === "BAD_REQUEST") {
    toast.error("Invalid request. Please try again later");
  } else if ((x?.data as { code: string })?.code === "UNAUTHORIZED") {
    toast.error("Unauthorized request. Please try again later");
  } else if (x?.message) {
    toast.error(x?.message);
  } else {
    toast.error("We are facing some issues! Please try again later");
  }
}

export const toPascalCase = (input: string): string => {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const parsePhoneNumber = (phoneInput: string): string => {
  if (!phoneInput || typeof phoneInput !== 'string') {
    return '';
  }
  
  const input = phoneInput.trim();
  if (input === '') {
    return '';
  }
  
  // Remove any non-numeric characters except the leading +
  let cleanedInput = input.replace(/[^\d+]/g, "");
  
  // Handle the leading + if it exists
  if (cleanedInput.startsWith('+')) {
    // Keep the + but clean the rest
    cleanedInput = '+' + cleanedInput.substring(1).replace(/\D/g, "");
  } else {
    // No + prefix, just clean and add one
    cleanedInput = '+' + cleanedInput.replace(/\D/g, "");
  }
  
  // Ensure we have at least some digits
  if (cleanedInput.length <= 1) {
    return '';
  }
  
  return cleanedInput;
};

export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
};

export const formatMoney = (input: string): string => {
  if (!input) return "";
  let value = "$";
  const number = Number(input);
  const numberString = number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  value += numberString;
  return value;
};

/**
 * Shortens any address for display purposes
 * @param address The full address
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns Shortened address with ellipsis in the middle
 */
export const shortenAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (!address) return '';
  
  // Remove any protocol prefix (like http:// or addr:)
  const cleanAddress = address.includes(':') 
    ? address.split(':').pop() || ''
    : address;
    
  if (cleanAddress.length <= startChars + endChars) {
    return cleanAddress;
  }
  
  const start = cleanAddress.substring(0, startChars);
  const end = cleanAddress.substring(cleanAddress.length - endChars);
  
  return `${start}...${end}`;
};
