"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GoogleAuthButtonProps = {
  children?: React.ReactNode
  className?: string
  nextPath?: string
}

export default function GoogleAuthButton({
  children = "Continue with Google",
  className,
  nextPath = "/",
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full gap-3", className)}
      onClick={() => {
        window.location.assign(`/auth/google?next=${encodeURIComponent(nextPath)}`)
      }}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.8 9.6-7.3 0-.5 0-.9-.1-1.3H12Z"
        />
        <path
          fill="#34A853"
          d="M2.4 12c0 1.9.5 3.6 1.5 5.1l3.5-2.7c-.4-.8-.6-1.5-.6-2.4s.2-1.7.6-2.4L3.9 6.9C2.9 8.4 2.4 10.1 2.4 12Z"
        />
        <path
          fill="#FBBC05"
          d="M12 21.6c2.7 0 4.9-.9 6.5-2.5l-3.2-2.5c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-4l-3.5 2.7c1.7 3.3 5.1 5.4 8.9 5.4Z"
        />
        <path
          fill="#4285F4"
          d="M18.5 19.1c1.9-1.8 3.1-4.4 3.1-7.4 0-.5 0-.9-.1-1.5H12v3.9h5.4c-.3 1.4-1.1 2.6-2.3 3.4l3.4 1.6Z"
        />
      </svg>
      <span>{children}</span>
    </Button>
  )
}
