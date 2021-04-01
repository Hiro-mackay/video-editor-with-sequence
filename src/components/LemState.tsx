import React, { useEffect } from 'react';

export const LemState = (props) => {
  useEffect(() => {
    console.log(props);
  }, [props.time]);
  return <div></div>;
};
