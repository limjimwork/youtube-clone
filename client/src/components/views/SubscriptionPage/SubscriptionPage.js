import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Card, Avatar, Typography, Row, Col } from "antd";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const subscriptionVariables = {
      userFrom: localStorage.getItem("userId"),
    };

    axios
      .post("/api/videos/getSubscriptionVideos", subscriptionVariables)
      .then((res) => {
        if (res.data.success) {
          setVideos(res.data.videos);
        } else {
          alert("Failed to lander videos.");
        }
      });
  }, []);

  const RenderCards = videos.map((video, idx) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={idx}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div className="duration">
              <span>
                {minutes}:{seconds}
              </span>
            </div>
          </div>
        </a>
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description=""
        />
        <span style={{ display: "block" }}>{video.writer.name}</span>
        <span style={{ marginLeft: "3rem" }}>{video.views} views</span>
        <span> - {moment(video.createdAt).format("MMM Do YY")}</span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>Subscription</Title>
      <Row gutter={[32, 16]}>{RenderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
