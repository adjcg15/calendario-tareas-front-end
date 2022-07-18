import React from 'react';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({children, auth}) => {
    return auth ? <Navigate to="/" /> : children;
}
