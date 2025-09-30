package com.jcb.jcb_management_systembackend.jcbmanagement.model;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.usermanagement.model.Owner;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
@Table(name = "jcb")
public class JCB {
    @Id
    @NotNull(message = "Registered number cannot be null")
    @Column(name = "registered_number")
    private String registeredNumber;

    @NotNull(message = "Engine number cannot be null")
    @Column(unique = true)
    private String engineNumber;

    @NotNull(message = "JCB type cannot be null")
    private String jcbType;

    @NotNull(message = "Rental price cannot be null")
    private double rentalPrice;

    @NotNull(message = "Availability cannot be null")
    @Column(name = "is_available", columnDefinition = "TINYINT DEFAULT 1")
    private Boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "owner_nic")
    private Owner owner;

    @OneToMany(mappedBy = "jcb")
    private List<Booking> bookings;

    public String getRegisteredNumber() {
        return registeredNumber;
    }

    public void setRegisteredNumber(String registeredNumber) {
        this.registeredNumber = registeredNumber;
    }

    public String getEngineNumber() {
        return engineNumber;
    }

    public void setEngineNumber(String engineNumber) {
        this.engineNumber = engineNumber;
    }

    public String getJcbType() {
        return jcbType;
    }

    public void setJcbType(String jcbType) {
        this.jcbType = jcbType;
    }

    public double getRentalPrice() {
        return rentalPrice;
    }

    public void setRentalPrice(double rentalPrice) {
        this.rentalPrice = rentalPrice;
    }

    public Boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @PrePersist
    public void prePersist() {
        if (isAvailable == null) {
            isAvailable = true;
        }
    }
}