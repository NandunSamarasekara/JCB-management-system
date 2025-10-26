package com.jcb.jcb_management_systembackend.reviewmanagement.repository;

import com.jcb.jcb_management_systembackend.reviewmanagement.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByCustomerId(String customerId);
    
    List<Review> findByBookingId(Long bookingId);
    
    List<Review> findByReviewType(Review.ReviewType reviewType);
    
    List<Review> findByRating(Integer rating);
    
    List<Review> findByCustomerIdAndReviewType(String customerId, Review.ReviewType reviewType);
    
    boolean existsByCustomerIdAndBookingId(String customerId, Long bookingId);
    
    void deleteByBookingId(Long bookingId);
}