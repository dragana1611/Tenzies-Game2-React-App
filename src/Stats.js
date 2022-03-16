import React from "react";
import Stopwatch from "./Stopwatch";

export default function Stats({ count, start, time, setTime, best }) {
  return (
    <div className="stats">
      <div>
        <p>
          Roll Count:
          <span>&nbsp;{count}</span>
        </p>
      </div>
      <div>
        <p className="pCTime">Current Time: </p>
        <span className="spanSW">
          &nbsp;
          <Stopwatch start={start} time={time} setTime={setTime} />
        </span>
      </div>
      <div>
        <p>
          Best Time:{" "}
          <span>
            &nbsp;
            <Stopwatch time={best.current} />
          </span>{" "}
          <span className="time-dif"></span>
        </p>
      </div>
    </div>
  );
}
