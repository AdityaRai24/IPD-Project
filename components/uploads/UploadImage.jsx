import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

const UploadImage = () => {
  const [publicId, setPublicId] = useState("");

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      {publicId && (
        <CldImage
          src={publicId}
          alt="Uploaded image"
          width="200"
          height="100"
          className="rounded-lg shadow-md mb-4"
        />
      )}
      <CldUploadWidget
        uploadPreset="Ipd-Project"
        onSuccess={({ event, info }) => {
          if (event === "success") {
            setPublicId(info?.public_id);
          }
        }}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            className="bg-primary  hover:opacity-40 text-white font-semibold py-2 px-4 rounded-md shadow-lg"
          >
            Upload an Image
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default UploadImage;
