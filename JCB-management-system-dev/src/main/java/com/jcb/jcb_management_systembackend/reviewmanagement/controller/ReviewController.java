package com.jcb.jcb_management_systembackend.reviewmanagement.controller;

import com.jcb.jcb_management_systembackend.reviewmanagement.model.Review;
import com.jcb.jcb_management_systembackend.reviewmanagement.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> createReview(@RequestBody CreateReviewRequest request) {
        String result = reviewService.createReviewWithDetails(
            request.getCustomerId(),
            request.getBookingId(),
            request.getRating(),
            request.getComment(),
            request.getReviewType(),
            request.getDriverRating(),
            request.getDriverComment(),
            request.getJcbRating(),
            request.getJcbComment()
        );
        
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getReviewsByCustomer(@PathVariable String customerId) {
        List<Review> reviews = reviewService.getReviewsByCustomer(customerId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Review>> getReviewsByBooking(@PathVariable Long bookingId) {
        List<Review> reviews = reviewService.getReviewsByBooking(bookingId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/type/{reviewType}")
    public ResponseEntity<List<Review>> getReviewsByType(@PathVariable Review.ReviewType reviewType) {
        List<Review> reviews = reviewService.getReviewsByType(reviewType);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable Long reviewId, @RequestBody UpdateReviewRequest request) {
        String result = reviewService.updateReview(
            reviewId,
            request.getCustomerId(),
            request.getRating(),
            request.getComment(),
            request.getDriverRating(),
            request.getDriverComment(),
            request.getJcbRating(),
            request.getJcbComment()
        );
        
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId, @RequestParam String customerId) {
        String result = reviewService.deleteReview(reviewId, customerId);
        
        if (result.startsWith("Success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats() {
        double averageRating = reviewService.getAverageRating();
        long totalReviews = reviewService.getTotalReviews();
        
        Map<String, Object> stats = Map.of(
            "averageRating", averageRating,
            "totalReviews", totalReviews
        );
        
        return ResponseEntity.ok(stats);
    }

    // DTOs for request bodies
    public static class CreateReviewRequest {
        private String customerId;
        private Long bookingId;
        private Integer rating;
        private String comment;
        private Review.ReviewType reviewType;
        private Integer driverRating;
        private String driverComment;
        private Integer jcbRating;
        private String jcbComment;

        public String getCustomerId() {
            return customerId;
        }

        public void setCustomerId(String customerId) {
            this.customerId = customerId;
        }

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public Review.ReviewType getReviewType() {
            return reviewType;
        }

        public void setReviewType(Review.ReviewType reviewType) {
            this.reviewType = reviewType;
        }

        public Integer getDriverRating() {
            return driverRating;
        }

        public void setDriverRating(Integer driverRating) {
            this.driverRating = driverRating;
        }

        public String getDriverComment() {
            return driverComment;
        }

        public void setDriverComment(String driverComment) {
            this.driverComment = driverComment;
        }

        public Integer getJcbRating() {
            return jcbRating;
        }

        public void setJcbRating(Integer jcbRating) {
            this.jcbRating = jcbRating;
        }

        public String getJcbComment() {
            return jcbComment;
        }

        public void setJcbComment(String jcbComment) {
            this.jcbComment = jcbComment;
        }
    }

    public static class UpdateReviewRequest {
        private String customerId;
        private Integer rating;
        private String comment;
        private Integer driverRating;
        private String driverComment;
        private Integer jcbRating;
        private String jcbComment;

        public String getCustomerId() {
            return customerId;
        }

        public void setCustomerId(String customerId) {
            this.customerId = customerId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public Integer getDriverRating() {
            return driverRating;
        }

        public void setDriverRating(Integer driverRating) {
            this.driverRating = driverRating;
        }

        public String getDriverComment() {
            return driverComment;
        }

        public void setDriverComment(String driverComment) {
            this.driverComment = driverComment;
        }

        public Integer getJcbRating() {
            return jcbRating;
        }

        public void setJcbRating(Integer jcbRating) {
            this.jcbRating = jcbRating;
        }

        public String getJcbComment() {
            return jcbComment;
        }

        public void setJcbComment(String jcbComment) {
            this.jcbComment = jcbComment;
        }
    }
}

