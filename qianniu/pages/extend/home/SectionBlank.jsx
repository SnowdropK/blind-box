import React, { useState, useEffect, useCallback } from "react";
import "./index.less";
import HotImg from "../../../assets/hot.png";

const SectionBlank = () => {
  const [count, setCount] = useState(0);
  const onAdd = () => setCount(count + 1);

  return (
    <div>
      <h1>欢迎使用小熊扭蛋机</h1>
    </div>
  );
};

export default SectionBlank;
