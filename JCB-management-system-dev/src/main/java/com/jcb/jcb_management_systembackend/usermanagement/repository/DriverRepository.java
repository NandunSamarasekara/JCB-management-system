package com.jcb.jcb_management_systembackend.usermanagement.repository;

import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, String> {
    boolean existsByEmail(String email);
    List<Driver> findByIsAvailableTrue();

    Optional<Driver> findByEmail(String email);
}