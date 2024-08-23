import {CldUploadWidget} from 'next-cloudinary';

const UploadImage = () => {
  return (
    <CldUploadWidget uploadPreset="Ipd-Project">
   {({ open }) => {
     return (
       <button onClick={() => open()}
        className="bg-primary rounded- py-2 px-4 mb-4 text-white">
         Upload an Image
       </button>
     );
   }}
 </CldUploadWidget>
  )
}

export default UploadImage
