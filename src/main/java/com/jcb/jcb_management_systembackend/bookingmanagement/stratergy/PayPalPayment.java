/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.jcb.jcb_management_systembackend.bookingmanagement.stratergy;

/**
 *
 * @author Nandun Samarasekara
 */
public class PayPalPayment implements PaymentStrategy {
    @Override
    public String processPayment(double amount) {
        // Simulate PayPal processing
        return "Payment of " + amount + " processed via PayPal. Transaction ID: PP-" + System.currentTimeMillis();
    }
}
