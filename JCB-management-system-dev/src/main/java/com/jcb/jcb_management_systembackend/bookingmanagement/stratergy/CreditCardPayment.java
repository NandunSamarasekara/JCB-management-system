/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.jcb.jcb_management_systembackend.bookingmanagement.stratergy;

/**
 *
 * @author Nandun Samarasekara
 */
public class CreditCardPayment implements PaymentStrategy {
    @Override
    public String processPayment(double amount) {
        // Simulate credit card processing (in real app, integrate with API)
        return "Payment of " + amount + " processed via Credit Card. Transaction ID: CC-" + System.currentTimeMillis();
    }
}