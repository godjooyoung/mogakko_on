import React, { useState } from 'react';

function useEnglishInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    const { value } = event.target;
    const onlyEnglish = /^[A-Za-z0-9]+$/; // 영어만 허용하는 정규식 패턴

    if (onlyEnglish.test(value) || value === '') {
      setValue(value);
    }
  };

  const resetValue = () => {
    setValue(initialValue);
  };

  return [value, handleChange, resetValue];
}

export default useEnglishInput