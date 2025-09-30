package com.jcb.jcb_management_systembackend.usermanagement.model;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
@Table(name = "driver")
public class Driver {
    @Id
    @NotNull(message = "NIC cannot be null")
    private String nic;

    @NotNull(message = "First name cannot be null")
    private String firstName;

    @NotNull(message = "Last name cannot be null")
    private String lastName;

    @NotNull(message = "Email cannot be null")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @NotNull(message = "Password cannot be null")
    private String password;

    @NotNull(message = "Availability cannot be null")
    @Column(name = "is_available", columnDefinition = "TINYINT DEFAULT 1")
    private Boolean isAvailable;

    @OneToMany(mappedBy = "driver")
    private List<Booking> bookings;

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
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