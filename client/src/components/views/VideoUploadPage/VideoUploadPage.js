import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const privateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const categoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Auto & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [category, setCategory] = useState(0);
  const [filePath, setFilePath] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivacyChange = (e) => {
    setPrivacy(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    axios.post("/api/videos/uploadfiles", formData, config).then((res) => {
      if (res.data.success) {
        let variable = {
          url: res.data.url,
          fileName: res.data.fileName,
        };

        setFilePath(res.data.url);

        axios.post("/api/videos/thumbnail", variable).then((res) => {
          if (res.data.success) {
            setDuration(res.data.fileDuration);
            setThumbnailPath(res.data.url);
          } else {
            alert("Failed to create a thumbnail.");
          }
        });
      } else {
        alert("Failed to Upload video.");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title,
      description,
      privacy,
      filePath,
      category,
      duration,
      thumbnail: thumbnailPath,
    };

    axios.post("/api/videos/uploadVideo", variables).then((res) => {
      if (res.data.success) {
        message.success("Success to upload the video.");
        setTimeout(() => {
          props.history.push("/");
        }, 3000);
      } else {
        alert("Failed to upload the video.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* Thumbnail */}
          {thumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${thumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <label>Title</label>
        <Input onChange={onTitleChange} value={title} />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={description} />
        <select
          onChange={onPrivacyChange}
          style={{ display: "block", marginBottom: "5px" }}
        >
          {privateOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          onChange={onCategoryChange}
          style={{ display: "block", marginBottom: "5px" }}
        >
          {categoryOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
