import * as React from 'react';

export function api(uri) {
  return `http://localhost:8000/api/${uri}`;
}