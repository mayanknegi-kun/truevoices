import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { userNameValidation } from '@/schemas/signupSchema'
import { error } from 'console'
import { z } from 'zod'

const UsernameUniqueSchema = z.object({
	username: userNameValidation,
})

export async function GET(request: Request) {
	await dbConnect()

	try {
		const { searchParams } = new URL(request.url)
		const queryparam = {
			username: searchParams.get('username'),
		}
		const result = UsernameUniqueSchema.safeParse(queryparam)
		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || []
			return Response.json(
				{
					success: false,
					message:
						usernameErrors.length > 0
							? usernameErrors.join(', ')
							: 'invalid query parameter',
				},
				{ status: 400 },
			)
		}
		const { username } = result.data
		const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
		if (existingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: 'Username already taken',
				},
				{ status: 400 },
			)
		}
		return Response.json(
			{
				success: true,
				message: 'Username is available',
			},
			{ status: 200 },
		)
	} catch (e) {
		console.error('Error checking username', error)
		return Response.json(
			{
				success: false,
				message: 'Error checking Username',
			},
			{ status: 500 },
		)
	}
}
