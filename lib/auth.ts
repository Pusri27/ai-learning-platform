import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

export async function getSession() {
    const supabase = await createClient();
    try {
        const {
            data: { session },
            error
        } = await supabase.auth.getSession();

        if (error) {
            // Suppress refresh token errors to prevent rate limiting
            if (error.message?.includes('refresh_token_not_found') ||
                error.message?.includes('Invalid Refresh Token')) {
                return null;
            }
            console.error('Session error:', error);
            return null;
        }

        return session;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        redirect('/auth/login');
    }
    return session;
}
