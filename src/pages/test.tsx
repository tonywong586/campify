import { useS3Upload } from "next-s3-upload";
import { useState } from "react";

export default function UploadPage() {
  let [imageUrl, setImageUrl] = useState("");
  let { uploadToS3 } = useS3Upload();

  let handleFileChange = async (file: File) => {
    // let file = event.target.files[0];
    let { url } = await uploadToS3(file);
    setImageUrl(url);
    console.log("Successfully uploaded to S3!", url);
  };

  return (
    <div>
      <input type="file" onChange={(e) => { handleFileChange(e.target.files![0]) }} />
      {imageUrl && <img src={imageUrl} />}
    </div>
  );
}