package com.jcb.jcb_management_systembackend.usermanagement.repository;

import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, String> {
    boolean existsByEmail(String email);
    List<Driver> findByIsAvailableTrue();
}