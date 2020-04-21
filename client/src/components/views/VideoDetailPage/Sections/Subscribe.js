import React, { useEffect, useState } from "react";
import Axios from "axios";

function Subscribe(props) {
  const [subscriberNumber, setSubscriberNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };

    Axios.post("/api/subscribe/subscriberNumber", variable).then((res) => {
      if (res.data.success) {
        setSubscriberNumber(res.data.subscriberNumber);
      } else {
        alert("Failed to get a number of subscriber.");
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    Axios.post("/api/subscribe/subscribed", subscribedVariable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert("Failed to get a subscribed information.");
      }
    });
  }, []);

  const onSubscribe = () => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    if (subscribed) {
      Axios.post("/api/subscribe/unsubscribe", subscribeVariable).then(
        (res) => {
          if (res.data.success) {
            setSubscriberNumber(subscriberNumber - 1);
            setSubscribed(!subscribed);
          } else {
            alert("Failed to unsubscribe.");
          }
        }
      );
    } else {
      Axios.post("/api/subscribe/subscribe", subscribeVariable).then((res) => {
        if (res.data.success) {
          setSubscriberNumber(subscriberNumber + 1);
          setSubscribed(!subscribed);
        } else {
          alert("Failed to subscribe.");
        }
      });
    }
  };

  return (
    <button
      style={{
        backgroundColor: `${subscribed ? "#cc0000" : "#aaa"}`,
        borderRadius: "4px",
        color: "#fff",
        padding: "10px 16px",
        fontWeight: "500",
        fontSize: "1rem",
        textTransform: "uppercase",
      }}
      onClick={onSubscribe}
    >
      {subscriberNumber}&nbsp;
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}

export default Subscribe;
