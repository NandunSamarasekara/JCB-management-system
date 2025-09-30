package com.jcb.jcb_management_systembackend.bookingmanagement.model;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import com.jcb.jcb_management_systembackend.usermanagement.model.Owner;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Customer NIC cannot be null")
    @Column(name = "customer_id")
    private String customerId;

    @NotNull(message = "Customer email cannot be null")
    private String customerEmail;

    @NotNull(message = "JCB ID cannot be null")
    @Column(name = "jcb_id")
    private String jcbId;

    @NotNull(message = "Owner NIC cannot be null")
    @Column(name = "owner_id")
    private String ownerId;

    @NotNull(message = "Owner email cannot be null")
    private String ownerEmail;

    @NotNull(message = "Driver NIC cannot be null")
    @Column(name = "driver_id")
    private String driverId;

    @NotNull(message = "Driver email cannot be null")
    private String driverEmail;

    @NotNull(message = "Rental date cannot be null")
    private Date rentalDate;

    @NotNull(message = "Return date cannot be null")
    private Date returnDate;

    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "jcb_id", insertable = false, updatable = false)
    private JCB jcb;

    @ManyToOne
    @JoinColumn(name = "driver_id", insertable = false, updatable = false)
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    private Owner owner;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getJcbId() {
        return jcbId;
    }

    public void setJcbId(String jcbId) {
        this.jcbId = jcbId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getDriverEmail() {
        return driverEmail;
    }

    public void setDriverEmail(String driverEmail) {
        this.driverEmail = driverEmail;
    }

    public Date getRentalDate() {
        return rentalDate;
    }

    public void setRentalDate(Date rentalDate) {
        this.rentalDate = rentalDate;
    }

    public Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
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

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = new Date();
        }
    }
}