import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const cookieStore = cookies();

        // Create response first so we can set cookies on it
        const response = NextResponse.json({ success: true }, { status: 200 });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Set cookie on both cookieStore and response
                        cookieStore.set({ name, value, ...options });
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options });
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        );

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Provide user-friendly error messages
            let errorMessage = 'Invalid email or password. Please try again.';

            // Handle specific error cases
            if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Email not verified. Please check your inbox.';
            } else if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.message.includes('Email')) {
                errorMessage = 'Invalid email format.';
            }

            return NextResponse.json({ error: errorMessage }, { status: 401 });
        }

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
    }
}
