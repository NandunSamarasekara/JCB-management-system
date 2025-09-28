package com.jcb.jcb_management_systembackend.bookingmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

@Entity
public class JCB {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull(message = "Registered number cannot be null")
    private String registeredNumber;

    @NotNull(message = "Engine number cannot be null")
    private String engineNumber;

    @NotNull(message = "JCB type cannot be null")
    private String jcbType;

    @NotNull(message = "Rental price cannot be null")
    private double rentalPrice;

    @NotNull(message = "Engine number cannot be null")
    private boolean isAvailable = true;

    @OneToMany(mappedBy = "jcb")
    private List<Booking> bookings;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        this.isAvailable = available;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}