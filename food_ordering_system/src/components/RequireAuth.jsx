import { useAuth } from "@/Providers/AuthProvider";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

export default function RequireAuth({ children }) {
  const { isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Bouncy size="45" speed="1.75" color="black" />;
  }

  if (!isLoading) {
    if (user && !user?.user._id) {
      return <Navigate to={"/signin"} state={{ from: location }} replace />;
    }
  }

  return children;
}
