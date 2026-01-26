'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'flat';
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
        const variants = {
            default: 'bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700',
            elevated: 'card-elevated',
            flat: 'bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700',
        };

        return (
            <div
                ref={ref}
                className={clsx(
                    variants[variant],
                    hover && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
