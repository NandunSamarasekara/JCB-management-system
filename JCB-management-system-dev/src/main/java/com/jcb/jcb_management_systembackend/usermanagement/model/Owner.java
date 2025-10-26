package com.jcb.jcb_management_systembackend.usermanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
@Table(name = "owner")
public class Owner {
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

    private String subscriptionPlan; // BASIC, NORMAL, PREMIUM
    
    private Double monthlyFee; // Monthly subscription fee in LKR

    @OneToMany(mappedBy = "owner")
    @JsonIgnoreProperties({"owner", "bookings"})
    private List<JCB> jcbs;

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

    public List<JCB> getJcbs() {
        return jcbs;
    }

    public void setJcbs(List<JCB> jcbs) {
        this.jcbs = jcbs;
    }

    public String getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(String subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
        // Set monthly fee based on plan
        if ("BASIC".equals(subscriptionPlan)) {
            this.monthlyFee = 0.0;
        } else if ("NORMAL".equals(subscriptionPlan)) {
            this.monthlyFee = 500.0;
        } else if ("PREMIUM".equals(subscriptionPlan)) {
            this.monthlyFee = 750.0;
        }
    }

    public Double getMonthlyFee() {
        return monthlyFee;
    }

    public void setMonthlyFee(Double monthlyFee) {
        this.monthlyFee = monthlyFee;
    }
}