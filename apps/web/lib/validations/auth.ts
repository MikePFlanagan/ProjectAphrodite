import { z } from 'zod';

export const loginSchema = z.object({ email: z.string().email('Enter a valid email address.'), password: z.string().min(8, 'Password must be at least 8 characters.') });
export const signupSchema = loginSchema.extend({ name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(60), confirmPassword: z.string() }).refine((values) => values.password === values.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });
