package com.jcb.jcb_management_systembackend.usermanagement.repository;

import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    boolean existsByEmail(String email);
}