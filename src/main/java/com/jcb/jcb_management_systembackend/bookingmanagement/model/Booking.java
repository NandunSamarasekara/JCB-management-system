package com.jcb.jcb_management_systembackend.bookingmanagement.model;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import com.jcb.jcb_management_systembackend.usermanagement.model.Driver;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "jcb_id")
    private JCB jcb;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @NotNull(message = "National Identity Card cannot be null")
    private String nic;

    @NotNull(message = "Period of use cannot be null")
    private String periodOfUse;

    private Date completedAt;

    private Date createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getPeriodOfUse() {
        return periodOfUse;
    }

    public void setPeriodOfUse(String periodOfUse) {
        this.periodOfUse = periodOfUse;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}