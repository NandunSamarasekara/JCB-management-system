# Update Booking Feature - Implementation Guide

## Overview
This document describes the implementation of the **Update Booking** feature that allows customers to edit their existing bookings.

## Features Implemented

### ✅ Backend Changes

#### 1. **BookingController.java**
Added new endpoint for updating bookings:

```java
@PutMapping("/{id}")
public ResponseEntity<String> updateBooking(@PathVariable Long id, @RequestBody UpdateBookingRequest request)
```

**Endpoint**: `PUT /api/bookings/{id}`

**Request Body**:
```json
{
  "jcbType": "Excavator",
  "rentalDate": "2025-10-20T00:00:00.000Z",
  "returnDate": "2025-10-25T00:00:00.000Z"
}
```

**Response**: Success or error message with new total price

#### 2. **BookingService.java**
Added `updateBooking()` method with the following functionality:

**Features**:
- ✅ Validates new rental and return dates
- ✅ Checks if booking exists
- ✅ Handles JCB type changes:
  - If JCB type changes, finds a new available JCB
  - Marks old JCB as available again
  - Assigns new JCB and marks it as unavailable
  - Updates owner information
- ✅ Updates rental and return dates
- ✅ Calculates new total price
- ✅ Transactional operation (rollback on failure)

**Business Logic**:
```java
@Transactional
public String updateBooking(Long bookingId, String newJcbType, Date newRentalDate, Date newReturnDate)
```

1. Validates dates
2. Retrieves existing booking
3. Checks if JCB type is changing
4. If changing:
   - Finds available JCB of new type
   - Releases old JCB
   - Assigns new JCB
   - Updates owner details
5. Updates dates
6. Saves booking
7. Calculates and returns new price

---

### ✅ Frontend Changes

#### 1. **api.js**
Added `updateBooking()` function to bookingAPI:

```javascript
updateBooking: async (bookingId, bookingData) => {
  const response = await api.put(`/api/bookings/${bookingId}`, bookingData);
  return response.data;
}
```

#### 2. **CustomerDashboard.jsx**
Enhanced with edit booking functionality:

**New State Variables**:
- `editMode`: Boolean to track if editing
- `editingBookingId`: Stores the ID of booking being edited

**New Functions**:
1. **`handleEditBooking(booking)`**
   - Switches to edit mode
   - Pre-fills form with existing booking data
   - Opens the booking form

2. **`handleUpdateBooking(e)`**
   - Validates input (JCB type, dates)
   - Sends PUT request to backend
   - Updates UI on success
   - Refreshes bookings and available JCBs

3. **`handleCancelEdit()`**
   - Exits edit mode
   - Resets form data
   - Closes form

**UI Changes**:
- Form title changes: "Book a JCB" → "Edit Booking"
- Submit button changes: "Submit Booking" → "Update Booking"
- Added "Edit" button next to "Cancel" in bookings table
- Checkboxes not required in edit mode
- Close button uses `handleCancelEdit()` instead of just closing

---

## How to Use

### For End Users

#### Editing a Booking:

1. **Navigate to Customer Dashboard**
   - Log in as a customer
   - Go to "My Bookings" section

2. **Click Edit Button**
   - Find the booking you want to edit
   - Click the blue "Edit" button

3. **Modify Booking Details**
   - Change JCB Type (if needed)
   - Update Rental Date
   - Update Return Date
   - Note: Customer NIC cannot be changed

4. **Submit Changes**
   - Click "Update Booking"
   - Wait for success message
   - View updated booking in table

#### What Can Be Updated:
- ✅ JCB Type (will assign a different JCB if available)
- ✅ Rental Date
- ✅ Return Date

#### What Cannot Be Updated:
- ❌ Customer NIC (read-only)
- ❌ Driver assignment (automatic)
- ❌ Owner (depends on JCB)

---

## API Endpoints Summary

### Update Booking
```
PUT /api/bookings/{id}
```

**Headers**:
```
Content-Type: application/json
Origin: http://localhost:3000
```

**Request**:
```json
{
  "jcbType": "Backhoe Loader",
  "rentalDate": "2025-10-22T00:00:00.000Z",
  "returnDate": "2025-10-27T00:00:00.000Z"
}
```

**Success Response**:
```json
"Success: Booking updated successfully. New total price: 2000.0"
```

**Error Responses**:
```json
"Error: Booking not found"
"Error: Invalid rental or return date"
"Error: No available JCBs of type Excavator"
```

---

## Validation Rules

### Backend Validation:
1. Rental date and return date must be provided
2. Return date must be after rental date
3. Booking must exist
4. If changing JCB type, must have available JCB of that type

### Frontend Validation:
1. JCB type must be selected
2. Both dates must be selected
3. Return date must be after rental date
4. Real-time validation with error messages

---

## Database Impact

### Tables Affected:
1. **`bookings`** table:
   - Updates: `jcb_id`, `owner_id`, `owner_email`, `rental_date`, `return_date`

2. **`jcb`** table:
   - Old JCB: `is_available` = 1 (available)
   - New JCB: `is_available` = 0 (unavailable)

3. **`driver`** table:
   - No changes (driver remains assigned)

### Transaction Safety:
- All operations wrapped in `@Transactional`
- Automatic rollback on any failure
- Ensures data consistency

---

## Testing Guide

### Test Case 1: Update Dates Only
**Steps**:
1. Create a booking
2. Click Edit
3. Change rental date to tomorrow
4. Change return date to 5 days from tomorrow
5. Click Update

**Expected**: Booking updated with new dates, same JCB

### Test Case 2: Update JCB Type
**Steps**:
1. Create a booking with JCB type "Excavator"
2. Click Edit
3. Change JCB type to "Backhoe Loader"
4. Keep same dates
5. Click Update

**Expected**: 
- Old JCB becomes available
- New JCB of "Backhoe Loader" type assigned
- New owner assigned
- New price calculated

### Test Case 3: Invalid Dates
**Steps**:
1. Edit a booking
2. Set return date before rental date
3. Click Update

**Expected**: Error message "Return date must be after rental date"

### Test Case 4: No Available JCB
**Steps**:
1. Edit a booking
2. Change to JCB type with no available units
3. Click Update

**Expected**: Error message "No available JCBs of type X"

### Test Case 5: Cancel Edit
**Steps**:
1. Click Edit on a booking
2. Make some changes
3. Click Close button

**Expected**: Form closes, changes discarded, booking unchanged

---

## Files Modified

### Backend:
1. `BookingController.java`
   - Added `updateBooking()` endpoint
   - Added `UpdateBookingRequest` DTO class

2. `BookingService.java`
   - Added `updateBooking()` method with full business logic

### Frontend:
1. `api.js`
   - Added `updateBooking()` function to bookingAPI

2. `CustomerDashboard.jsx`
   - Added edit mode state management
   - Added `handleEditBooking()` function
   - Added `handleUpdateBooking()` function
   - Added `handleCancelEdit()` function
   - Updated form to support both create and edit modes
   - Added Edit button to bookings table
   - Updated button labels based on mode

---

## Future Enhancements

### Possible Improvements:
1. ✨ Allow updating payment method
2. ✨ Add booking history/audit trail
3. ✨ Email notification on booking update
4. ✨ Price comparison when changing JCB type
5. ✨ Driver preference selection
6. ✨ Partial refund calculation if shortening rental period
7. ✨ Conflict checking for date ranges
8. ✨ Booking status tracking (Pending, Confirmed, In Progress, Completed)

---

## Troubleshooting

### Issue: "Booking not found" error
**Solution**: Ensure the booking ID is correct and the booking exists in the database

### Issue: "No available JCBs" error
**Solution**: 
- Check database for available JCBs of the requested type
- Mark some JCBs as available: `UPDATE jcb SET is_available = 1;`

### Issue: Edit button doesn't appear
**Solution**: 
- Ensure backend is running
- Check browser console for errors
- Refresh the page

### Issue: Form doesn't pre-fill
**Solution**:
- Check that booking object has all required fields
- Verify `booking.jcb.jcbType` exists
- Check date format conversion

---

## Summary

The Update Booking feature provides customers with flexibility to modify their bookings as needed. It handles:
- ✅ Date changes
- ✅ JCB type changes with automatic reassignment
- ✅ Price recalculation
- ✅ Validation and error handling
- ✅ Transactional safety
- ✅ User-friendly interface

This feature enhances the overall user experience and reduces the need for canceling and recreating bookings.

---

**Implementation Status**: ✅ **COMPLETE**

**Last Updated**: 2025-10-18
