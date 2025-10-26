/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.jcb.jcb_management_systembackend.bookingmanagement.stratergy;

/**
 *
 * @author Nandun Samarasekara
 */
public class CashPayment implements PaymentStrategy {
    @Override
    public String processPayment(double amount) {
        // Simulate cash (e.g., mark as pending for in-person payment)
        return "Cash payment of " + amount + " pending. Please pay at pickup. Reference: CASH-" + System.currentTimeMillis();
    }
}
