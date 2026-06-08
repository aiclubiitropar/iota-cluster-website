"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  defaultText: string;
  loadingText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SubmitButton({ 
  defaultText, 
  loadingText = "Saving...", 
  className = "btn-primary",
  style 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className={className} 
      style={{ 
        ...style, 
        opacity: pending ? 0.7 : 1, 
        cursor: pending ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem"
      }}
    >
      {pending && (
        <svg 
          className="animate-spin" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ animation: "spin 1s linear infinite" }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
      )}
      {pending ? loadingText : defaultText}
    </button>
  );
}
