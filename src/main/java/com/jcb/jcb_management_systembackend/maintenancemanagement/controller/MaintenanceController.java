package com.jcb.jcb_management_systembackend.maintenancemanagement.controller;

import com.jcb.jcb_management_systembackend.maintenancemanagement.model.Maintenance;
import com.jcb.jcb_management_systembackend.maintenancemanagement.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<String> createMaintenanceReport(@RequestBody CreateMaintenanceRequest request) {
        String result = maintenanceService.createMaintenanceReport(
            request.getJcbId(),
            request.getDriverId(),
            request.getIssueType(),
            request.getSeverity(),
            request.getDescription()
        );
        
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByDriver(@PathVariable String driverId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByDriver(driverId));
    }

    @GetMapping("/mechanic/{mechanicId}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByMechanic(@PathVariable String mechanicId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByMechanic(mechanicId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByOwner(@PathVariable String ownerId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByOwner(ownerId));
    }

    @GetMapping("/jcb/{jcbId}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByJcb(@PathVariable String jcbId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByJcb(jcbId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByStatus(@PathVariable String status) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateMaintenanceStatus(
            @PathVariable Long id,
            @RequestBody UpdateMaintenanceRequest request) {
        String result;
        
        // If only status and mechanicNotes are provided, use the old method (for mechanics)
        if (request.getJcbId() == null && request.getDriverId() == null && 
            request.getIssueType() == null && request.getSeverity() == null && 
            request.getDescription() == null) {
            result = maintenanceService.updateMaintenanceStatus(
                id,
                request.getStatus(),
                request.getMechanicNotes()
            );
        } else {
            // Full update (for drivers editing their reports)
            result = maintenanceService.updateMaintenanceRecord(
                id, 
                request.getJcbId(), 
                request.getDriverId(), 
                request.getIssueType(), 
                request.getSeverity(), 
                request.getDescription(), 
                request.getStatus(), 
                request.getMechanicNotes()
            );
        }
        
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMaintenance(@PathVariable Long id) {
        boolean deleted = maintenanceService.deleteMaintenance(id);
        if (deleted) {
            return ResponseEntity.ok("Maintenance record deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to delete maintenance record");
        }
    }

    // DTOs
    public static class CreateMaintenanceRequest {
        private String jcbId;
        private String driverId;
        private String issueType;
        private String severity;
        private String description;

        public String getJcbId() {
            return jcbId;
        }

        public void setJcbId(String jcbId) {
            this.jcbId = jcbId;
        }

        public String getDriverId() {
            return driverId;
        }

        public void setDriverId(String driverId) {
            this.driverId = driverId;
        }

        public String getIssueType() {
            return issueType;
        }

        public void setIssueType(String issueType) {
            this.issueType = issueType;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class UpdateMaintenanceRequest {
        private String jcbId;
        private String driverId;
        private String issueType;
        private String severity;
        private String description;
        private String status;
        private String mechanicNotes;

        public String getJcbId() {
            return jcbId;
        }

        public void setJcbId(String jcbId) {
            this.jcbId = jcbId;
        }

        public String getDriverId() {
            return driverId;
        }

        public void setDriverId(String driverId) {
            this.driverId = driverId;
        }

        public String getIssueType() {
            return issueType;
        }

        public void setIssueType(String issueType) {
            this.issueType = issueType;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getMechanicNotes() {
            return mechanicNotes;
        }

        public void setMechanicNotes(String mechanicNotes) {
            this.mechanicNotes = mechanicNotes;
        }
    }
}
