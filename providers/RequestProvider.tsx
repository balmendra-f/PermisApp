"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getRequest } from "@/api/request/getRequest";
import { getRequestsBySection } from "@/api/request/getRequestBySection";

export interface Request {
  updatedAt: any;
  id: string;
  userId: string;
  section: string;
  tipoPermiso: string;
  motivo: string;
  fechaInicio: any;
  fechaFin: any;
  isPending: boolean;
  aproved: boolean;
  createdAt: any;
  documento: any;
  username: string;
}

interface RequestsContextType {
  requests: Request[];
  loading: boolean;
  fetchBySection: (section: string) => (() => void) | void;
}

const RequestsContext = createContext<RequestsContextType>({
  requests: [],
  loading: true,
  fetchBySection: () => {},
});

export const RequestsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getRequest((data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchBySection = (section: string) => {
    setLoading(true);
    const unsubscribe = getRequestsBySection(section, (data) => {
      setRequests(data);
      setLoading(false);
    });

    return unsubscribe;
  };

  return (
    <RequestsContext.Provider value={{ requests, loading, fetchBySection }}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsContext);
