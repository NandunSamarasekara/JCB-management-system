package com.jcb.jcb_management_systembackend.bookingmanagement.controller;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.bookingmanagement.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jcbs")
public class JCBController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/available")
    public List<JCB> getAvailableJCBs() {
        return bookingService.getAvailableJCBs();
    }
}