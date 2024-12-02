import React, { useState } from "react";
import AWS from "aws-sdk";
import { Box, Typography } from "@mui/material";

const FileUploader = (props) => {
  const { displayType, uploadType } = props;

  const [selectedFile, setSelectedFile] = useState("");

  const onInputClick = (event) => {
    const element = event.target;
    element.value = "";
  };

  function validFileType(fileList) {
    const allowedExtensions = ["jpeg", "jpg", "png"];
    const invalidExtension = fileList?.some(
      (file) =>
        !allowedExtensions.includes(file?.name?.split(".").pop()?.toLowerCase())
    );
    if (invalidExtension) {
      alert("Only JPEG and PNG files are allowed");
      return;
    }
    return true;
  }

  const handleChange = (event) => {
    if (!event?.target.files || event?.target?.files?.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (event?.target?.files?.length) {
      try {
        const fileList = Array.from(event.target.files);
        if (validFileType(fileList)) {
          const maxSize = 1024 * 1024 * 50;
          const totalSize = fileList?.reduce(
            (total, file) => total + file.size,
            0
          );
          if (totalSize > maxSize) {
            alert("All File size exceeds the maximum limit (50MB)");
            event.target.value = "";
            return;
          } else {
            setSelectedFile(fileList);
            if (
              displayType === "animalPhotos" ||
              displayType === "muzzlePhotos"
            ) {
              uploadFileToS3(fileList[0]);
            }
          }
        } else {
          alert("Max file size should be less than 50 MB");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadFileToS3 = async (file) => {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AccessKeyId,
      secretAccessKey: process.env.REACT_APP_SecretAccessKey,
      region: process.env.REACT_APP_Region, // Corrected region format
    });

    // Create an S3 instance
    const s3 = new AWS.S3();

    const bucketName = process.env.REACT_APP_BucketName;
    const key = file.name; // Change this according to your needs

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: "image/jpeg",
    };

    try {
      // Upload the image to S3
      const data = await s3.upload(params).promise();

      if (displayType === "animalPhotos") {
        const updatedUploadIdImages = {
          ...props?.uploadIdImages,
          [`${uploadType}ResponseFiles`]: data,
        };

        let uploadedLocation;

        if (uploadType === "frontSide") {
          uploadedLocation =
            updatedUploadIdImages?.frontSideResponseFiles?.Location;
        } else if (uploadType === "backSide") {
          uploadedLocation =
            updatedUploadIdImages?.backSideResponseFiles?.Location;
        } else if (uploadType === "leftSide") {
          uploadedLocation =
            updatedUploadIdImages?.leftSideResponseFiles?.Location;
        } else if (uploadType === "rightSide") {
          uploadedLocation =
            updatedUploadIdImages?.rightSideResponseFiles?.Location;
        }
        props.setUploadedFiles(updatedUploadIdImages);
        alert("File uploaded successfully.");
      } else if (displayType === "muzzlePhotos") {
        const updatedUploadIdImages = {
          ...props?.uploadMuzzleImages,
          [`${uploadType}ResponseFiles`]: data,
        };
        let uploadedLocation;

        if (uploadType === "straightMuzzle") {
          uploadedLocation =
            updatedUploadIdImages?.straightMuzzleResponseFiles?.Location;
        } else if (uploadType === "straightFace") {
          uploadedLocation =
            updatedUploadIdImages?.straightFaceResponseFiles?.Location;
        } else if (uploadType === "topMuzzle") {
          uploadedLocation =
            updatedUploadIdImages?.topMuzzleResponseFiles?.Location;
        } else if (uploadType === "lowerMuzzle") {
          uploadedLocation =
            updatedUploadIdImages?.lowerMuzzleResponseFiles?.Location;
        } else if (uploadType === "leftMuzzle") {
          uploadedLocation =
            updatedUploadIdImages?.leftMuzzleResponseFiles?.Location;
        } else if (uploadType === "rightMuzzle") {
          uploadedLocation =
            updatedUploadIdImages?.rightMuzzleResponseFiles?.Location;
        } else if (uploadType === "leftFace") {
          uploadedLocation =
            updatedUploadIdImages?.leftFaceResponseFiles?.Location;
        } else if (uploadType === "rightFace") {
          uploadedLocation =
            updatedUploadIdImages?.rightFaceResponseFiles?.Location;
        }
        props.setUploadMuzzleImages(updatedUploadIdImages);
        alert("File uploaded successfully.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleClick = () => {
    document.getElementById(`${props?.uploadType}`).click();
  };

  return (
    <>
      {displayType === "animalPhotos" && (
        <>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"200px"}
            width={"180px"}
          >
            <Typography
              fontFamily={"MetropolisMedium"}
              fontSize={"14px"}
              sx={{ wordBreak: "break-word" }}
            >
              {props.heading}
            </Typography>

            {props?.image ? (
              <img
                src={props.image}
                alt="logo"
                style={{
                  width: "180px",
                  height: "200px",
                  cursor: "pointer",
                  objectFit: "contain",
                }}
              />
            ) : null}
          </Box>
        </>
      )}

      {displayType === "muzzlePhotos" && (
        <>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"200px"}
            width={"180px"}
          >
            <Typography
              fontFamily={"MetropolisMedium"}
              fontSize={"14px"}
              sx={{ wordBreak: "break-word" }}
            >
              {props.heading}
            </Typography>

            {props?.image ? (
              <img
                src={props.image}
                alt="logo"
                style={{
                  width: "180px",
                  height: "200px",
                  cursor: "pointer",
                  objectFit: "contain",
                }}
              />
            ) : null}
          </Box>
        </>
      )}

      <input
        id={`${props?.uploadType}`}
        name={props?.uploadType}
        key={`${props?.uploadType ?? ""}-uploaded-key-${selectedFile?.Key}`}
        type="file"
        onChange={(event) => handleChange(event)}
        accept={props?.accept?.[0]}
        onClick={onInputClick}
        style={{ display: "none" }}
        multiple={false} //props.multiple
        defaultValue={props.defaultValue}
      />
    </>
  );
};

export default FileUploader;
