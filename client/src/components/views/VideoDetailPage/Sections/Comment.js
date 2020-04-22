import React, { useState } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";

import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const user = useSelector((state) => state.user);
  const [commentValue, setCommentValue] = useState("");

  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoId: props.videoId,
    };

    Axios.post("/api/comment/saveComment", variables).then((res) => {
      if (res.data.success) {
        setCommentValue("");
        props.refreshFunction(res.data.result);
      } else {
        alert("Failed to save the comment.");
      }
    });
  };

  return (
    <div>
      <p>Replies</p>
      <hr />
      {props.commentLists &&
        props.commentLists.map(
          (comment, idx) =>
            !comment.responseTo && (
              <div key={idx}>
                <SingleComment
                  writer={user.userData._id}
                  videoId={props.videoId}
                  comment={comment}
                  responseTo={comment._id}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  videoId={props.videoId}
                  commentLists={props.commentLists}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </div>
            )
        )}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleChange}
          value={commentValue}
          placeholder="Write a comment."
        />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
