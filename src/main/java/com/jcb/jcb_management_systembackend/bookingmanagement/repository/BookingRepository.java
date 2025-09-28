package com.jcb.jcb_management_systembackend.bookingmanagement.repository;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, String> {
}