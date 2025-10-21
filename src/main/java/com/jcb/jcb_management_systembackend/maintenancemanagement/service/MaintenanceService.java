package com.jcb.jcb_management_systembackend.maintenancemanagement.service;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.jcbmanagement.repository.JCBRepository;
import com.jcb.jcb_management_systembackend.maintenancemanagement.model.Maintenance;
import com.jcb.jcb_management_systembackend.maintenancemanagement.repository.MaintenanceRepository;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.usermanagement.model.Mechanic;
import com.jcb.jcb_management_systembackend.usermanagement.repository.DriverRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.MechanicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private JCBRepository jcbRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private MechanicRepository mechanicRepository;

    public String createMaintenanceReport(String jcbId, String driverId, String issueType, 
                                         String severity, String description) {
        try {
            // Validate JCB exists
            Optional<JCB> jcbOpt = jcbRepository.findById(jcbId);
            if (!jcbOpt.isPresent()) {
                return "Error: JCB with ID " + jcbId + " not found";
            }
            JCB jcb = jcbOpt.get();

            // Validate Driver exists
            Optional<Driver> driverOpt = driverRepository.findById(driverId);
            if (!driverOpt.isPresent()) {
                return "Error: Driver with ID " + driverId + " not found";
            }

            // Get all mechanics
            List<Mechanic> mechanics = mechanicRepository.findAll();
            if (mechanics.isEmpty()) {
                return "Error: No mechanics available in the system";
            }

            // Auto-assign mechanic (simple round-robin or random)
            Mechanic assignedMechanic = mechanics.get(new Random().nextInt(mechanics.size()));

            // Create maintenance record
            Maintenance maintenance = new Maintenance();
            maintenance.setJcbId(jcbId);
            maintenance.setDriverId(driverId);
            maintenance.setMechanicId(assignedMechanic.getNic());
            maintenance.setOwnerId(jcb.getOwner() != null ? jcb.getOwner().getNic() : null);
            maintenance.setIssueType(issueType);
            maintenance.setSeverity(severity);
            maintenance.setDescription(description);
            maintenance.setStatus("ASSIGNED");
            maintenance.setReportedDate(new Date());
            maintenance.setAssignedDate(new Date());

            maintenanceRepository.save(maintenance);

            return "Success: Maintenance report created and assigned to mechanic " + 
                   assignedMechanic.getFirstName() + " " + assignedMechanic.getLastName();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to create maintenance report - " + e.getMessage();
        }
    }

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public List<Maintenance> getMaintenanceByDriver(String driverId) {
        return maintenanceRepository.findByDriverId(driverId);
    }

    public List<Maintenance> getMaintenanceByMechanic(String mechanicId) {
        return maintenanceRepository.findByMechanicId(mechanicId);
    }

    public List<Maintenance> getMaintenanceByOwner(String ownerId) {
        return maintenanceRepository.findByOwnerId(ownerId);
    }

    public List<Maintenance> getMaintenanceByJcb(String jcbId) {
        return maintenanceRepository.findByJcbId(jcbId);
    }

    public List<Maintenance> getMaintenanceByStatus(String status) {
        return maintenanceRepository.findByStatus(status);
    }

    public String updateMaintenanceStatus(Long maintenanceId, String status, String mechanicNotes) {
        try {
            Optional<Maintenance> maintenanceOpt = maintenanceRepository.findById(maintenanceId);
            if (!maintenanceOpt.isPresent()) {
                return "Error: Maintenance record not found";
            }

            Maintenance maintenance = maintenanceOpt.get();
            maintenance.setStatus(status);
            
            if (mechanicNotes != null && !mechanicNotes.isEmpty()) {
                maintenance.setMechanicNotes(mechanicNotes);
            }

            if ("IN_PROGRESS".equals(status) && maintenance.getAssignedDate() == null) {
                maintenance.setAssignedDate(new Date());
            }

            if ("COMPLETED".equals(status)) {
                maintenance.setCompletedDate(new Date());
            }

            maintenanceRepository.save(maintenance);
            return "Success: Maintenance status updated to " + status;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to update maintenance status - " + e.getMessage();
        }
    }

    // New method for full maintenance update (for drivers)
    public String updateMaintenanceRecord(Long maintenanceId, String jcbId, String driverId, 
                                         String issueType, String severity, String description,
                                         String status, String mechanicNotes) {
        try {
            Optional<Maintenance> maintenanceOpt = maintenanceRepository.findById(maintenanceId);
            if (!maintenanceOpt.isPresent()) {
                return "Error: Maintenance record not found";
            }

            Maintenance maintenance = maintenanceOpt.get();
            
            // Update basic fields if provided
            if (jcbId != null && !jcbId.isEmpty()) {
                // Validate JCB exists
                Optional<JCB> jcbOpt = jcbRepository.findById(jcbId);
                if (!jcbOpt.isPresent()) {
                    return "Error: JCB not found";
                }
                JCB jcb = jcbOpt.get();
                maintenance.setJcbId(jcbId);
                // Update owner ID from the new JCB
                maintenance.setOwnerId(jcb.getOwner() != null ? jcb.getOwner().getNic() : null);
            }
            
            if (driverId != null && !driverId.isEmpty()) {
                maintenance.setDriverId(driverId);
            }
            
            if (issueType != null && !issueType.isEmpty()) {
                maintenance.setIssueType(issueType);
            }
            
            if (severity != null && !severity.isEmpty()) {
                maintenance.setSeverity(severity);
            }
            
            if (description != null && !description.isEmpty()) {
                maintenance.setDescription(description);
            }
            
            if (status != null && !status.isEmpty()) {
                maintenance.setStatus(status);
            }
            
            if (mechanicNotes != null && !mechanicNotes.isEmpty()) {
                maintenance.setMechanicNotes(mechanicNotes);
            }

            maintenanceRepository.save(maintenance);
            return "Success: Maintenance record updated successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to update maintenance record - " + e.getMessage();
        }
    }

    public boolean deleteMaintenance(Long maintenanceId) {
        try {
            if (maintenanceRepository.existsById(maintenanceId)) {
                maintenanceRepository.deleteById(maintenanceId);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
