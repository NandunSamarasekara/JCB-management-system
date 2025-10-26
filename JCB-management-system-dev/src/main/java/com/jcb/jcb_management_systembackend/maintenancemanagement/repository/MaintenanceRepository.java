package com.jcb.jcb_management_systembackend.maintenancemanagement.repository;

import com.jcb.jcb_management_systembackend.maintenancemanagement.model.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByDriverId(String driverId);
    List<Maintenance> findByMechanicId(String mechanicId);
    List<Maintenance> findByOwnerId(String ownerId);
    List<Maintenance> findByJcbId(String jcbId);
    List<Maintenance> findByStatus(String status);
}
