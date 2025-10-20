package com.jcb.jcb_management_systembackend.reviewmanagement.service;

import com.jcb.jcb_management_systembackend.reviewmanagement.model.Review;
import com.jcb.jcb_management_systembackend.reviewmanagement.repository.ReviewRepository;
import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.bookingmanagement.repository.BookingRepository;
import com.jcb.jcb_management_systembackend.usermanagement.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public String createReview(String customerId, Long bookingId, Integer rating, String comment, Review.ReviewType reviewType) {
        // Validate inputs
        if (rating == null || rating < 1 || rating > 5) {
            return "Error: Rating must be between 1 and 5";
        }

        // Check if customer exists
        if (!customerRepository.existsById(customerId)) {
            return "Error: Customer with NIC " + customerId + " not found";
        }

        // Check if booking exists and belongs to customer
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            return "Error: Booking with ID " + bookingId + " not found";
        }

        Booking booking = bookingOpt.get();
        if (!booking.getCustomerId().equals(customerId)) {
            return "Error: Booking does not belong to this customer";
        }

        // Check if customer has already reviewed this booking
        if (reviewRepository.existsByCustomerIdAndBookingId(customerId, bookingId)) {
            return "Error: You have already reviewed this booking";
        }

        // Create new review
        Review review = new Review(customerId, bookingId, rating, comment, reviewType);
        reviewRepository.save(review);

        return "Success: Review submitted successfully";
    }

    public String createReviewWithDetails(String customerId, Long bookingId, Integer rating, String comment, 
                                         Review.ReviewType reviewType, Integer driverRating, String driverComment,
                                         Integer jcbRating, String jcbComment) {
        // Validate inputs
        if (rating == null || rating < 1 || rating > 5) {
            return "Error: Overall rating must be between 1 and 5";
        }
        
        if (driverRating != null && (driverRating < 1 || driverRating > 5)) {
            return "Error: Driver rating must be between 1 and 5";
        }
        
        if (jcbRating != null && (jcbRating < 1 || jcbRating > 5)) {
            return "Error: JCB rating must be between 1 and 5";
        }

        // Check if customer exists
        if (!customerRepository.existsById(customerId)) {
            return "Error: Customer with NIC " + customerId + " not found";
        }

        // Check if booking exists and belongs to customer
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            return "Error: Booking with ID " + bookingId + " not found";
        }

        Booking booking = bookingOpt.get();
        if (!booking.getCustomerId().equals(customerId)) {
            return "Error: Booking does not belong to this customer";
        }

        // Check if customer has already reviewed this booking
        if (reviewRepository.existsByCustomerIdAndBookingId(customerId, bookingId)) {
            return "Error: You have already reviewed this booking";
        }

        // Create new review with details
        Review review = new Review(customerId, bookingId, rating, comment, reviewType);
        review.setDriverRating(driverRating);
        review.setDriverComment(driverComment);
        review.setJcbRating(jcbRating);
        review.setJcbComment(jcbComment);
        reviewRepository.save(review);

        return "Success: Review submitted successfully";
    }

    public List<Review> getReviewsByCustomer(String customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }

    public List<Review> getReviewsByBooking(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId);
    }

    public List<Review> getReviewsByType(Review.ReviewType reviewType) {
        return reviewRepository.findByReviewType(reviewType);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public String updateReview(Long reviewId, String customerId, Integer rating, String comment) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            return "Error: Review not found";
        }

        Review review = reviewOpt.get();
        if (!review.getCustomerId().equals(customerId)) {
            return "Error: You can only update your own reviews";
        }

        if (rating != null && (rating < 1 || rating > 5)) {
            return "Error: Rating must be between 1 and 5";
        }

        if (rating != null) {
            review.setRating(rating);
        }
        if (comment != null) {
            review.setComment(comment);
        }

        reviewRepository.save(review);
        return "Success: Review updated successfully";
    }

    public String deleteReview(Long reviewId, String customerId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (!reviewOpt.isPresent()) {
            return "Error: Review not found";
        }

        Review review = reviewOpt.get();
        if (!review.getCustomerId().equals(customerId)) {
            return "Error: You can only delete your own reviews";
        }

        reviewRepository.delete(review);
        return "Success: Review deleted successfully";
    }

    public double getAverageRating() {
        List<Review> reviews = reviewRepository.findAll();
        if (reviews.isEmpty()) {
            return 0.0;
        }

        double sum = reviews.stream().mapToInt(Review::getRating).sum();
        return sum / reviews.size();
    }

    public long getTotalReviews() {
        return reviewRepository.count();
    }
}

