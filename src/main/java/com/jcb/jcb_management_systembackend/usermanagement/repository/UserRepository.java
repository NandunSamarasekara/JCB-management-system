package com.jcb.jcb_management_systembackend.usermanagement.repository;

import com.jcb.jcb_management_systembackend.usermanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

}