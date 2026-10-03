"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BookingData = {
  packageId: string;
  packageTitle: string;
  packageImage: string;
  pricePerAdult: number;
  pricePerChild: number;
  adultsCount: number;
  childrenCount: number;
  visitDate: string;
  totalPrice: number;
};

type BookingContextType = {
  bookingData: BookingData | null;
  setBookingData: (data: BookingData | null) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
