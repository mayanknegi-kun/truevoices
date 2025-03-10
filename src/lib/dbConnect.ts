import mongoose, { mongo } from 'mongoose'

type ConnectionObject = {
	isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log('Already Connected')
		return
	}
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || '')
		connection.isConnected = db.connection.readyState
		console.log('DB connect successfully')
	} catch (e) {
		console.log('Database connection fail', e)
		process.exit(1)
	}
}

export default dbConnect
