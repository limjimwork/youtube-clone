import React, { useState, useEffect } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;

    props.commentLists.map((comment, idx) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);
  }, []);

  const renderReplyComment = (parentCommentId) => {
    return props.commentLists.map(
      (comment, idx) =>
        comment.responseTo === parentCommentId && (
          <div key={idx} style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              writer={comment.writer._id}
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
    );
  };

  const onHandleChange = () => {
    setOpenReplyComments(!openReplyComments);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          stlye={{ fontSize: "14px", margin: "0", color: "#777" }}
          onClick={onHandleChange}
        >
          View {childCommentNumber} more comment(s).
        </p>
      )}
      {openReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
