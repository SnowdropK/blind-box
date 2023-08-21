import React, { useState, useEffect, useCallback } from 'react';
import "./index.less";

const SectionBlank = () => {
  const [ count, setCount ] = useState(0);
  const onAdd = () => setCount(count + 1);

  return (
    <div>
      <h1>Home</h1>
      <button onClick={onAdd}>click</button>
      <span>{count}</span>
    </div>
  );
};

export default SectionBlank;

