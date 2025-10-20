package com.jcb.jcb_management_systembackend.bookingmanagement.repository;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(String customerId);
}