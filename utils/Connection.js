export const Connection = async()=>{
    try {
        await mongoose.connect("mongodb+srv://IPD:scrubdaddy@ipd-project.qgvbz.mongodb.net/?retryWrites=true&w=majority&appName=IPD-Project")
        console.log("connection successfull")
    } catch (error) {
        console.log(error)
    }
}