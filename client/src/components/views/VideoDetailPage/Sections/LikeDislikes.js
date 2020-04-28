import React, { useEffect, useState } from "react";
import Axios from "axios";

import { Tooltip, Icon } from "antd";

function LikeDislikes(props) {
  const [likes, setLikes] = useState(0);
  const [likeAction, setLikeAction] = useState(null);
  const [dislikes, setDislikes] = useState(0);
  const [dislikeAction, setDislikeAction] = useState(null);

  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((res) => {
      if (res.data.success) {
        // 좋아요 총 개수
        setLikes(res.data.likes.length);
        // 내가 좋아요를 눌렀는지 유무
        res.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("Failed to get information.");
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((res) => {
      if (res.data.success) {
        // 싫어요 총 개수
        setDislikes(res.data.dislikes.length);
        // 내가 싫어요를 눌렀는지 유무
        res.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("Failed to get information.");
      }
    });
  }, []);

  const onLike = () => {
    if (likeAction === null) {
      Axios.post("/api/like/upLike", variable).then((res) => {
        if (res.data.success) {
          setLikes(likes + 1);
          setLikeAction("liked");

          if (dislikeAction !== null) {
            setDislikes(dislikes - 1);
            setDislikeAction(null);
          }
        } else {
          alert("Failed to like.");
        }
      });
    } else {
      Axios.post("/api/like/unLike", variable).then((res) => {
        if (res.data.success) {
          setLikes(likes - 1);
          setLikeAction(null);
        } else {
          alert("Failed to unlike.");
        }
      });
    }
  };

  const onDislike = () => {
    if (dislikeAction !== null) {
      Axios.post("/api/like/unDislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(dislikes - 1);
          setDislikeAction(null);
        } else {
          alert("Faile to dislike.");
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(dislikes + 1);
          setDislikeAction("disliked");

          if (likeAction !== null) {
            setLikeAction(null);
            setLikes(likes - 1);
          }
        } else {
          alert("Faile to dislike.");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={likeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ padding: "0 5px", cursor: "auto" }}> {likes}</span>
      </span>
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={dislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ padding: "0 5px", cursor: "auto" }}> {dislikes}</span>
      </span>
    </div>
  );
}

export default LikeDislikes;
