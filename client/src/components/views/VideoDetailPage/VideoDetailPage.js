import React, { useEffect, useState } from "react";
import axios from "axios";

import { Row, Col, Avatar, List } from "antd";

import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const userId = localStorage.getItem("userId");
  const variable = { videoId };
  const [videoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    axios.post("/api/videos/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("Failed to load the video.");
      }
    });
  }, []);

  if (videoDetail.writer) {
    const subscribeButton = videoDetail.writer._id !== userId && (
      <Subscribe userTo={videoDetail.writer} userFrom={userId} />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />
            </List.Item>
            {/* comments */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div> ... loading </div>;
  }
}

export default VideoDetailPage;
