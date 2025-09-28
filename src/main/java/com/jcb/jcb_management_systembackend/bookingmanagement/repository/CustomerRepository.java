package com.jcb.jcb_management_systembackend.bookingmanagement.repository;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {
}