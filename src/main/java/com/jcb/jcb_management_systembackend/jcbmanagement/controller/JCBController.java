package com.jcb.jcb_management_systembackend.jcbmanagement.controller;

import com.jcb.jcb_management_systembackend.jcbmanagement.model.JCB;
import com.jcb.jcb_management_systembackend.jcbmanagement.repository.JCBRepository;
import com.jcb.jcb_management_systembackend.bookingmanagement.service.BookingService;
import com.jcb.jcb_management_systembackend.usermanagement.model.Owner;
import com.jcb.jcb_management_systembackend.usermanagement.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jcbs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class JCBController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JCBRepository jcbRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @GetMapping("/available")
    public List<JCB> getAvailableJCBs() {
        return bookingService.getAvailableJCBs();
    }

    @GetMapping
    public List<JCB> getAllJCBs() {
        return jcbRepository.findAll();
    }

    @GetMapping("/owner/{ownerNic}")
    public ResponseEntity<List<JCB>> getJCBsByOwner(@PathVariable String ownerNic) {
        Optional<Owner> ownerOpt = ownerRepository.findById(ownerNic);
        if (!ownerOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        List<JCB> ownerJcbs = jcbRepository.findByOwner(ownerOpt.get());
        return ResponseEntity.ok(ownerJcbs);
    }

    @PostMapping
    public ResponseEntity<String> addJCB(@RequestBody AddJCBRequest request) {
        System.out.println("Received isAvailable: " + request.getIsAvailable()); // Debug log
        Optional<Owner> ownerOpt = ownerRepository.findById(request.getOwnerNic());
        if (!ownerOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Error: Owner with NIC " + request.getOwnerNic() + " not found");
        }

        // Check if registeredNumber already exists
        if (jcbRepository.existsById(request.getRegisteredNumber())) {
            return ResponseEntity.badRequest().body("Error: JCB with registered number " + request.getRegisteredNumber() + " already exists");
        }

        JCB jcb = new JCB();
        jcb.setRegisteredNumber(request.getRegisteredNumber());
        jcb.setEngineNumber(request.getEngineNumber());
        jcb.setJcbType(request.getJcbType());
        jcb.setRentalPrice(request.getRentalPrice());
        jcb.setAvailable(request.getIsAvailable());
        jcb.setOwner(ownerOpt.get());

        JCB savedJcb = jcbRepository.save(jcb);
        System.out.println("Saved isAvailable: " + savedJcb.isAvailable()); // Debug log
        return ResponseEntity.ok("Success: JCB added with registered number " + request.getRegisteredNumber());
    }

    @PutMapping("/{registeredNumber}/availability")
    public ResponseEntity<String> updateJCBAvailability(
            @PathVariable String registeredNumber,
            @RequestBody UpdateAvailabilityRequest request) {
        Optional<JCB> jcbOpt = jcbRepository.findById(registeredNumber);
        if (!jcbOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Error: JCB with registered number " + registeredNumber + " not found");
        }
        
        JCB jcb = jcbOpt.get();
        jcb.setAvailable(request.getIsAvailable());
        jcbRepository.save(jcb);
        return ResponseEntity.ok("Success: JCB availability updated");
    }

    // DTO for request body
    public static class AddJCBRequest {
        private String registeredNumber;
        private String engineNumber;
        private String jcbType;
        private double rentalPrice;
        private Boolean isAvailable;
        private String ownerNic;

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

        public Boolean getIsAvailable() {
            return isAvailable;
        }

        public void setIsAvailable(Boolean isAvailable) {
            this.isAvailable = isAvailable;
        }

        public String getOwnerNic() {
            return ownerNic;
        }

        public void setOwnerNic(String ownerNic) {
            this.ownerNic = ownerNic;
        }
    }

    public static class UpdateAvailabilityRequest {
        private Boolean isAvailable;

        public Boolean getIsAvailable() {
            return isAvailable;
        }

        public void setIsAvailable(Boolean isAvailable) {
            this.isAvailable = isAvailable;
        }
    }
}