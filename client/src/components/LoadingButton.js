import React from 'react';
import { Button } from 'react-bootstrap';

export default ({
  loading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoadingButton${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {!loading ? text : loadingText}
  </Button>;
