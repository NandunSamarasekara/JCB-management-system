/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.jcb.jcb_management_systembackend.bookingmanagement.stratergy;

/**
 *
 * @author Nandun Samarasekara
 */
public interface PaymentStrategy {
    String processPayment(double amount);
}
