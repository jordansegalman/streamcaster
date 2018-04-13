import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import './LoaderButton.css';

export default ({
  loading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Glyphicon glyph="refresh" className="spinning" />}
    {!loading ? text : loadingText}
  </Button>;
