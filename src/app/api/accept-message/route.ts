import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { User } from 'next-auth'

export async function POST(req: Request) {
	await dbConnect()

	const session = await getServerSession(authOptions)
	const user: User = session?.user as User

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: 'Not Authenticated',
			},
			{ status: 401 },
		)
	}

	const userId = user._id
	const { acceptMessages } = await req.json()
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingMessage: acceptMessages },
			{ new: true },
		)
		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: 'Failed to update accept message status',
				},
				{ status: 401 },
			)
		}
		return Response.json(
			{
				success: true,
				message: 'Successfully updated accept message status',
				updatedUser,
			},
			{ status: 200 },
		)
	} catch (err) {
		console.log('failed to update accept message status')
		return Response.json(
			{
				success: false,
				message: 'Failed to update accept message status',
			},
			{ status: 500 },
		)
	}
}

export async function GET(req: Request) {
	await dbConnect()

	const session = await getServerSession(authOptions)
	const user: User = session?.user as User

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: 'Not Authenticated',
			},
			{ status: 401 },
		)
	}

	const userId = user._id

	try {
		const foundUser = await UserModel.findById(userId)
		if (!foundUser) {
			return Response.json(
				{
					success: false,
					message: 'User not found',
				},
				{ status: 404 },
			)
		}

		return Response.json(
			{
				success: true,
				isAcceptingMessage: foundUser.isAcceptingMessage,
			},
			{ status: 200 },
		)
	} catch (err) {
		return Response.json(
			{
				success: false,
				message: 'Error in fetching user status',
			},
			{ status: 500 },
		)
	}
}
