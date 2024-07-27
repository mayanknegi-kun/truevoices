import { z } from 'zod'

export const userNameValidation = z
	.string()
	.min(2, 'Username must be at least 2 characters')
	.max(20, 'Must be no more than 20 characters')

export const signupSchema = z.object({
	username: userNameValidation,
	email: z.string().email({ message: 'invalid email' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})
