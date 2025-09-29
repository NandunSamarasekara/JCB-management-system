package com.jcb.jcb_management_systembackend.jcbmanagement.repository;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JCBRepository extends JpaRepository<JCB, String> {
    List<JCB> findByJcbTypeAndIsAvailableTrue(String jcbType);
    List<JCB> findByIsAvailableTrue();
}