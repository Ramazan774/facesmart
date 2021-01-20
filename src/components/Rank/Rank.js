import React from "react";

const Rank = () => {
  return (
    <div>
      <div className="white f3">{`${name}, your current entry rank is ...`}</div>
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
