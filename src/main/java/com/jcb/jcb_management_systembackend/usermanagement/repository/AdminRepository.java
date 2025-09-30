package com.jcb.jcb_management_systembackend.usermanagement.repository;

import com.jcb.jcb_management_systembackend.usermanagement.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, String> {
    boolean existsByEmail(String email);
}