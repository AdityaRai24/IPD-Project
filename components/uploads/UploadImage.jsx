import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

const UploadImage = () => {
  const [publicId,setpublicId] = useState("");
  return (
    <>
    {publicId && <CldImage src={publicId} alt={publicId} width={"200"} height={"100"}/>}
    <CldUploadWidget
      uploadPreset="Ipd-Project"
      onSuccess={({ event, info }) => {
        if(event === "success"){
          setpublicId(info?.public_id)
        }
      }}
    >
      {({ open }) => {
        return (
          <button
            onClick={() => open()}
            className="bg-primary rounded- py-2 px-4 mb-4 text-white"
          >
            Upload an Image
          </button>
        );
      }}
    </CldUploadWidget>
    </>
  );
};

export default UploadImage;
