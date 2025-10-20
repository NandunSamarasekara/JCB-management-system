# Review Management System - Complete Guide

## Overview
The Review Management feature allows customers to submit detailed reviews about their JCB rental experience, including separate ratings for driver service and JCB equipment quality. Admins can view and analyze all submitted reviews.

---

## Features Implemented

### 1. **Customer Features**
- ⭐ **Add Reviews Button**: Available in the "My Bookings" section for each booking
- 📝 **Comprehensive Review Form**: 
  - Overall experience rating (1-5 stars)
  - Overall comments
  - Driver service rating (1-5 stars)
  - Driver service comments
  - JCB equipment rating (1-5 stars)
  - JCB equipment comments
  - Review type selection (SERVICE_REVIEW, FEEDBACK, COMPLAINT)
- 📋 **My Reviews Section**: Display all reviews submitted by the customer
- 🎨 **Beautiful Modal UI**: Modern, responsive design with star rating system

### 2. **Admin Features**
- 📊 **Statistics Dashboard**: 
  - Total reviews count
  - Average rating
  - Filtered reviews count
- 🔍 **Advanced Filtering**: Filter by review type (All, Service Review, Feedback, Complaint)
- 📑 **Comprehensive Review Display**:
  - Overall, Driver, and JCB ratings side-by-side
  - All comments displayed
  - Review metadata (ID, customer, booking, date)
  - Visual indicators for review types
- 📈 **Analytics Section**: Reviews breakdown by type with percentages

---

## Backend Implementation

### Updated Files

#### 1. **Review.java** (`reviewmanagement/model/Review.java`)
Added new fields for detailed ratings:
```java
private Integer driverRating;     // Rating for driver (1-5)
private String driverComment;     // Comment about driver service
private Integer jcbRating;        // Rating for JCB equipment (1-5)
private String jcbComment;        // Comment about JCB condition/performance
```

#### 2. **ReviewService.java** (`reviewmanagement/service/ReviewService.java`)
New method for creating detailed reviews:
```java
public String createReviewWithDetails(
    String customerId, 
    Long bookingId, 
    Integer rating, 
    String comment, 
    Review.ReviewType reviewType, 
    Integer driverRating, 
    String driverComment,
    Integer jcbRating, 
    String jcbComment
)
```

**Validation**:
- All ratings must be between 1-5
- Customer and booking validation
- Prevents duplicate reviews for same booking

#### 3. **ReviewController.java** (`reviewmanagement/controller/ReviewController.java`)
Updated endpoints and DTOs:
- Added driver and JCB fields to `CreateReviewRequest` DTO
- CORS configured for `localhost:3000` and `localhost:5173`

**Available Endpoints**:
```
POST   /api/reviews                          - Create new review
GET    /api/reviews/customer/{customerId}    - Get customer's reviews
GET    /api/reviews/booking/{bookingId}      - Get reviews for booking
GET    /api/reviews/type/{reviewType}        - Get reviews by type
GET    /api/reviews/all                      - Get all reviews (Admin)
GET    /api/reviews/stats                    - Get review statistics
PUT    /api/reviews/{reviewId}               - Update review
DELETE /api/reviews/{reviewId}               - Delete review
```

---

## Frontend Implementation

### New/Updated Files

#### 1. **AddReviewModal.jsx** (`frontend/src/components/AddReviewModal.jsx`)
Beautiful modal component with:
- **Interactive star rating system**
- **Three separate rating sections**:
  - Overall experience
  - Driver service
  - JCB equipment
- **Form validation**
- **Loading states**
- **Error handling**

#### 2. **CustomerDashboard.jsx** (`frontend/src/pages/CustomerDashboard.jsx`)
Enhanced with review features:
- **Review button** (⭐) in bookings table Actions column
- **My Reviews section** displaying all submitted reviews
- **Payment status column** added to bookings table
- **Review modal integration**
- **Auto-refresh after review submission**

#### 3. **AdminDashboard.jsx** (`frontend/src/pages/AdminDashboard.jsx`) - NEW!
Complete admin interface featuring:
- **Statistics cards** with total reviews and average rating
- **Filter functionality** by review type
- **Detailed review cards** showing all ratings and comments
- **Analytics section** with percentage breakdowns
- **Refresh button** to reload data
- **Color-coded review types**

#### 4. **api.js** (`frontend/src/services/api.js`)
New reviewAPI service:
```javascript
reviewAPI: {
  createReview(reviewData),
  getCustomerReviews(customerNic),
  getAllReviews(),
  getStats(),
  deleteReview(reviewId, customerId)
}
```

#### 5. **App.jsx** (`frontend/src/App.jsx`)
Updated routing:
- Imported `AdminDashboard` component
- Replaced placeholder with actual component
- Protected route configured for ADMIN role

---

## Usage Guide

### For Customers

#### Step 1: Submit a Review
1. Login to your account as a **CUSTOMER**
2. Navigate to **Customer Dashboard**
3. Scroll to **"My Bookings"** section
4. Click the **⭐ Review** button next to any booking
5. Fill out the review form:
   - **Overall Experience**: Rate 1-5 stars and add comments
   - **Driver Service**: Rate 1-5 stars and add specific feedback
   - **JCB Equipment**: Rate 1-5 stars and add equipment feedback
   - **Review Type**: Select SERVICE_REVIEW, FEEDBACK, or COMPLAINT
6. Click **Submit Review**

#### Step 2: View Your Reviews
- Scroll to **"My Reviews"** section in Customer Dashboard
- See all your submitted reviews with:
  - Booking ID and submission date
  - All ratings displayed visually
  - All comments shown
  - Color-coded review type badges

### For Admins

#### Step 1: Access Admin Dashboard
1. Login as an **ADMIN** user
2. You'll be redirected to `/dashboard/admin`

#### Step 2: View Statistics
- Top cards show:
  - **Total Reviews**: Overall count
  - **Average Rating**: System-wide average
  - **Filtered Count**: Current filter results

#### Step 3: Filter Reviews
- Use the **Filter by Type** dropdown:
  - All Reviews
  - Service Reviews
  - Feedback
  - Complaints
- Click **🔄 Refresh** to reload data

#### Step 4: Analyze Reviews
- Each review card shows:
  - **Header**: Review ID, type badge, customer ID, booking ID, timestamp
  - **Overall Rating**: Stars and comments
  - **Driver Rating**: Stars and specific comments
  - **JCB Rating**: Stars and specific comments
  - **Average**: Calculated average of all ratings

#### Step 5: View Analytics
- Bottom section shows review distribution:
  - Count and percentage for each type
  - Color-coded cards matching review type badges

---

## Database Schema

### Review Table Fields
```sql
id                  BIGINT          - Primary key
customer_id         VARCHAR(255)    - Customer NIC
booking_id          BIGINT          - Foreign key to Booking
rating              INTEGER         - Overall rating (1-5)
comment             TEXT            - Overall comment
driver_rating       INTEGER         - Driver rating (1-5)
driver_comment      VARCHAR(500)    - Driver feedback
jcb_rating          INTEGER         - JCB rating (1-5)
jcb_comment         VARCHAR(500)    - JCB feedback
review_type         ENUM            - SERVICE_REVIEW, FEEDBACK, COMPLAINT
created_at          TIMESTAMP       - Auto-generated
```

---

## API Request/Response Examples

### Create Review Request
```json
POST /api/reviews
{
  "customerId": "200012345678",
  "bookingId": 1,
  "rating": 5,
  "comment": "Excellent service overall!",
  "driverRating": 5,
  "driverComment": "Very professional and punctual driver",
  "jcbRating": 4,
  "jcbComment": "Equipment was in good condition, minor scratches",
  "reviewType": "SERVICE_REVIEW"
}
```

### Response
```json
"Success: Review submitted successfully"
```

### Get Customer Reviews
```json
GET /api/reviews/customer/200012345678

Response: [
  {
    "id": 1,
    "customerId": "200012345678",
    "bookingId": 1,
    "rating": 5,
    "comment": "Excellent service overall!",
    "driverRating": 5,
    "driverComment": "Very professional and punctual driver",
    "jcbRating": 4,
    "jcbComment": "Equipment was in good condition, minor scratches",
    "reviewType": "SERVICE_REVIEW",
    "createdAt": "2025-10-20T10:30:00"
  }
]
```

### Get Statistics
```json
GET /api/reviews/stats

Response: {
  "averageRating": 4.5,
  "totalReviews": 25
}
```

---

## Color Coding

### Review Type Colors
- **SERVICE_REVIEW**: 🔵 Blue (`bg-blue-100 text-blue-800`)
- **FEEDBACK**: 🟢 Green (`bg-green-100 text-green-800`)
- **COMPLAINT**: 🔴 Red (`bg-red-100 text-red-800`)

### Payment Status Colors (in Bookings)
- **COMPLETED**: 🟢 Green
- **PENDING**: 🟡 Yellow
- **FAILED**: 🔴 Red

---

## Validation Rules

### Rating Validation
- All ratings (overall, driver, JCB) must be between **1-5**
- Invalid ratings return error: "Rating must be between 1 and 5"

### Business Rules
- Customer must exist in database
- Booking must exist and belong to customer
- Cannot submit duplicate reviews for same booking
- All ratings are optional except overall rating

---

## UI Components

### Star Rating Display
- **Filled stars**: Yellow (★)
- **Empty stars**: Gray (☆)
- **Interactive**: Click to set rating
- **Hover effect**: Changes color on hover

### Modal Features
- **Fixed overlay**: Dark semi-transparent background
- **Centered positioning**: Responsive on all screen sizes
- **Scrollable content**: For long forms
- **Sticky header**: Title and close button always visible
- **Action buttons**: Cancel (gray) and Submit (blue)
- **Loading states**: Disabled during submission

---

## Testing Checklist

### Customer Flow
- [ ] Customer can see Review button for each booking
- [ ] Clicking Review button opens modal
- [ ] Star ratings are interactive and update correctly
- [ ] All form fields accept input
- [ ] Form validates ratings (1-5)
- [ ] Submit button shows loading state
- [ ] Success message appears after submission
- [ ] Modal closes after successful submission
- [ ] New review appears in "My Reviews" section
- [ ] Cancel button closes modal without saving

### Admin Flow
- [ ] Admin can access `/dashboard/admin`
- [ ] Statistics cards display correct numbers
- [ ] Filter dropdown works correctly
- [ ] Reviews display with all details
- [ ] Star ratings render correctly
- [ ] Color coding matches review types
- [ ] Refresh button reloads data
- [ ] Analytics section shows correct percentages
- [ ] Page is responsive on mobile devices

### Backend Flow
- [ ] POST /api/reviews creates new review
- [ ] Validation rejects invalid ratings
- [ ] GET endpoints return correct data
- [ ] Statistics calculation is accurate
- [ ] CORS allows frontend access
- [ ] Database saves all fields correctly

---

## Troubleshooting

### Common Issues

#### 1. Review Not Appearing
- **Check**: Customer NIC matches logged-in user
- **Check**: Booking ID exists in database
- **Solution**: Verify customer and booking exist before submission

#### 2. CORS Error
- **Check**: Backend CORS configuration includes frontend URL
- **Solution**: Ensure `@CrossOrigin` annotation on ReviewController includes your frontend port

#### 3. Rating Validation Error
- **Check**: Rating values are integers between 1-5
- **Solution**: Ensure star click handler sets integer values, not strings

#### 4. Admin Dashboard Not Loading
- **Check**: User role is exactly "ADMIN" (case-sensitive)
- **Check**: Route protection in App.jsx
- **Solution**: Verify user.userRole === 'ADMIN' in database

---

## Future Enhancements

### Potential Features
1. **Edit/Delete Reviews**: Allow customers to modify their reviews
2. **Review Responses**: Let admins respond to reviews
3. **Image Upload**: Add photos to reviews
4. **Rating Breakdown**: Show distribution (how many 5-star, 4-star, etc.)
5. **Featured Reviews**: Highlight best reviews on homepage
6. **Email Notifications**: Notify admins of new complaints
7. **Export Reviews**: Download as CSV/PDF for reporting
8. **Review Reminders**: Auto-email customers after booking completion

---

## Security Considerations

### Implemented
✅ Customer can only view their own reviews  
✅ Admin role required to view all reviews  
✅ Validation prevents invalid data  
✅ CORS configured for specific origins  

### Recommended
- Add rate limiting to prevent spam reviews
- Implement profanity filter for comments
- Add review flagging for inappropriate content
- Require booking completion before allowing reviews

---

## File Structure

```
JCB_management_system/
│
├── src/main/java/.../reviewmanagement/
│   ├── model/
│   │   └── Review.java                    ✅ Updated
│   ├── controller/
│   │   └── ReviewController.java          ✅ Updated
│   ├── service/
│   │   └── ReviewService.java             ✅ Updated
│   └── repository/
│       └── ReviewRepository.java          (Existing)
│
├── frontend/src/
│   ├── components/
│   │   └── AddReviewModal.jsx             ✅ NEW
│   ├── pages/
│   │   ├── CustomerDashboard.jsx          ✅ Updated
│   │   └── AdminDashboard.jsx             ✅ NEW
│   ├── services/
│   │   └── api.js                         ✅ Updated
│   └── App.jsx                            ✅ Updated
│
└── REVIEW_MANAGEMENT_GUIDE.md             ✅ NEW (this file)
```

---

## Summary

The Review Management system is now fully functional with:
- ✅ Customer review submission with separate driver and JCB ratings
- ✅ Beautiful modal UI with interactive star ratings
- ✅ Customer review history display
- ✅ Comprehensive admin dashboard with filtering and analytics
- ✅ Full backend validation and error handling
- ✅ Complete API integration
- ✅ Responsive design for all devices

**Next Steps**: Test the complete flow by creating a customer account, making a booking, submitting a review, then logging in as admin to view all reviews.
