import React, { useEffect, useState } from "react";
import axios from "axios";

function SideVideo() {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/videos/getVideos").then((res) => {
      if (res.data.success) {
        setSideVideos(res.data.videos);
      } else {
        alert("Failed to get Videos.");
      }
    });
  }, []);

  const RenderSideVideo = sideVideos.map((video, idx) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={idx}
        style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}
      >
        <div style={{ width: "45%", marginRight: "5%" }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>
        <div style={{ widht: "50%" }}>
          <a href={`/video/${video._id}`} style={{ color: "#777" }}>
            <span style={{ fontSize: "1rem", color: "#000" }}>
              {video.title}
            </span>
            <span style={{ display: "block" }}>{video.writer.name}</span>
            <span style={{ display: "block" }}>{video.views} views</span>
            <span style={{ display: "block" }}>
              {minutes}:{seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return <div style={{ marginTop: "3rem" }}>{RenderSideVideo}</div>;
}

export default SideVideo;
