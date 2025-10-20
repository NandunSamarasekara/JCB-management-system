package com.jcb.jcb_management_systembackend.reviewmanagement.model;

import com.jcb.jcb_management_systembackend.bookingmanagement.model.Booking;
import com.jcb.jcb_management_systembackend.usermanagement.model.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.util.Date;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Customer NIC cannot be null")
    @Column(name = "customer_id")
    private String customerId;

    @NotNull(message = "Booking ID cannot be null")
    @Column(name = "booking_id")
    private Long bookingId;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Column(length = 1000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Review type cannot be null")
    private ReviewType reviewType;

    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "booking_id", insertable = false, updatable = false)
    private Booking booking;

    public enum ReviewType {
        SERVICE_REVIEW, COMPLAINT, FEEDBACK
    }

    // Constructors
    public Review() {
        this.createdAt = new Date();
    }

    public Review(String customerId, Long bookingId, Integer rating, String comment, ReviewType reviewType) {
        this();
        this.customerId = customerId;
        this.bookingId = bookingId;
        this.rating = rating;
        this.comment = comment;
        this.reviewType = reviewType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public ReviewType getReviewType() {
        return reviewType;
    }

    public void setReviewType(ReviewType reviewType) {
        this.reviewType = reviewType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }
}
