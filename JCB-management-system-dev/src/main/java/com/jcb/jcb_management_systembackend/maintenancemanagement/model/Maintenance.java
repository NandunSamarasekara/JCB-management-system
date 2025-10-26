package com.jcb.jcb_management_systembackend.maintenancemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.usermanagement.model.Mechanic;
import com.jcb.jcb_management_systembackend.usermanagement.model.Owner;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
@Table(name = "maintenance")
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "JCB ID cannot be null")
    @Column(name = "jcb_id")
    private String jcbId;

    @NotNull(message = "Driver ID cannot be null")
    @Column(name = "driver_id")
    private String driverId;

    @Column(name = "mechanic_id")
    private String mechanicId;

    @Column(name = "owner_id")
    private String ownerId;

    @NotNull(message = "Issue type cannot be null")
    private String issueType; // ENGINE, HYDRAULIC, ELECTRICAL, STRUCTURAL, OTHER

    @NotNull(message = "Severity cannot be null")
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @NotNull(message = "Description cannot be null")
    @Column(length = 1000)
    private String description;

    private String status; // PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(length = 1000)
    private String mechanicNotes;

    private Date reportedDate;

    private Date assignedDate;

    private Date completedDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "jcb_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"bookings", "owner"})
    private JCB jcb;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"bookings", "password"})
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mechanic_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password"})
    private Mechanic mechanic;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"jcbs", "password"})
    private Owner owner;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getMechanicId() {
        return mechanicId;
    }

    public void setMechanicId(String mechanicId) {
        this.mechanicId = mechanicId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
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

    public Date getReportedDate() {
        return reportedDate;
    }

    public void setReportedDate(Date reportedDate) {
        this.reportedDate = reportedDate;
    }

    public Date getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(Date assignedDate) {
        this.assignedDate = assignedDate;
    }

    public Date getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(Date completedDate) {
        this.completedDate = completedDate;
    }

    public JCB getJcb() {
        return jcb;
    }

    public void setJcb(JCB jcb) {
        this.jcb = jcb;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Mechanic getMechanic() {
        return mechanic;
    }

    public void setMechanic(Mechanic mechanic) {
        this.mechanic = mechanic;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    @PrePersist
    public void prePersist() {
        if (reportedDate == null) {
            reportedDate = new Date();
        }
        if (status == null) {
            status = "PENDING";
        }
    }
}
