package com.jcb.jcb_management_systembackend.bookingmanagement.repository;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.JCB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JCBRepository extends JpaRepository<JCB, String> {
    List<JCB> findByJcbTypeAndIsAvailableTrue(String jcbType);
    List<JCB> findByIsAvailableTrue();
}