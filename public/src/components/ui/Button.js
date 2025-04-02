```javascript
import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils"

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                    variant === "outline" &&
                    "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
                    variant === "ghost" &&
                    "text-foreground hover:bg-accent hover:text-accent-foreground",
                    variant === "link" && "text-primary underline-offset-4 hover:underline",
                    size === "icon" && "h-9 w-9 p-0",
                    size === "sm" && "h-9 px-3",
                    size === "lg" && "h-11 px-6",
                    !(variant === "outline" || variant === "ghost" || variant === "link") &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    className
                )}
                {...props}
            >
                {props.children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
```;
