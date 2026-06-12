import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_DB_URI.replace(
            '<db_username>',
            process.env.MONGO_DB_USERNAME
        )
            .replace('<db_password>', process.env.MONGO_DB_PASSWORD)
            .replace('<db_name>', process.env.MONGO_DB_NAME)

        await mongoose.connect(dbURI)
        console.log('✅-Base de datos conectada')
    } catch (error) {
        console.log(error)
    }
}


export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log('❌-Base de datos desconectada')
    } catch (error) {
        console.log('Error al desconectar la base de datos', error)
    }

}