/** @format */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Index } from '../views/index';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
};
