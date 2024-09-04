import AddNewInterView from "@/components/AddNewInterView"
import Navbar from "@/components/navbar/Navbar"


const page = () => {
  return (
    
      <div className="p-10">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <h2 className="text-gray-500">Create and Start your AI Mockup Interview</h2>
ww
      <div className=" grid grid-cols-1 my-5">
        <AddNewInterView/>
      </div>
      </div>
    
  )
}

export default page
