# Quick Start Guide - JCB Management System

## 🚀 Quick Setup (5 minutes)

### Step 1: Database Setup
```sql
-- Open MySQL and run:
CREATE DATABASE jcb_management;
```

### Step 2: Configure Backend
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jcb_management
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

### Step 3: Start Backend
```bash
# In project root directory
mvnw.cmd spring-boot:run
```
✅ Backend runs on http://localhost:8080

### Step 4: Start Frontend
```bash
# In new terminal, navigate to frontend folder
cd frontend
npm run dev
```
✅ Frontend runs on http://localhost:3000

## 🎯 Test the Application

### 1. Register a New Customer
- Open http://localhost:3000
- Click "Register"
- Fill in the form:
  - NIC: `123456789V`
  - Email: `customer@test.com`
  - Username: `testcustomer`
  - First Name: `John`
  - Last Name: `Doe`
  - Password: `password123`
  - Confirm Password: `password123`
  - Role: Select `Customer`
- Click "Register"
- You'll be redirected to login page

### 2. Login
- Email: `customer@test.com`
- Password: `password123`
- Role: `Customer`
- Click "Sign In"
- You'll be redirected to Customer Dashboard

### 3. Before Booking - Create Test Data (Optional)
To test booking functionality, you need JCB equipment in the database. You can:

**Option A: Use database directly**
```sql
-- First, create an owner
INSERT INTO owner (nic, first_name, last_name, email, password)
VALUES ('owner123', 'Owner', 'Test', 'owner@test.com', 'password');

-- Then create a JCB
INSERT INTO jcb (registered_number, engine_number, jcb_type, rental_price, is_available, owner_nic)
VALUES ('JCB001', 'ENG001', 'Excavator', 500.00, 1, 'owner123');

INSERT INTO jcb (registered_number, engine_number, jcb_type, rental_price, is_available, owner_nic)
VALUES ('JCB002', 'ENG002', 'Backhoe Loader', 400.00, 1, 'owner123');

-- Create a driver
INSERT INTO driver (nic, first_name, last_name, email, password, is_available)
VALUES ('driver123', 'Driver', 'Test', 'driver@test.com', 'password', 1);
```

**Option B: Wait for Owner/Admin features**
(Coming in future updates)

### 4. Book a JCB
- In Customer Dashboard, click "Book a JCB"
- Select JCB Type: `Excavator`
- Choose Rental Date: Tomorrow's date
- Choose Return Date: 3 days from now
- Check both checkboxes:
  - ✅ Accept rental price
  - ✅ Accept terms and conditions
- Click "Submit Booking"
- See success message with booking details!

### 5. View Your Bookings
- Scroll down to "My Bookings" section
- See your booking with:
  - Booking ID
  - JCB ID (e.g., JCB001)
  - Rental and Return dates
  - Assigned driver email
- You can cancel bookings by clicking "Cancel"

### 6. View Available JCBs
- Scroll to "Available JCBs" section
- See all available equipment with:
  - JCB Type
  - Registration Number
  - Engine Number
  - Daily rental price

## 📱 User Flow Summary

```
1. Homepage (/)
   ├─> Register (/register)
   │   └─> Success → Login
   │
   └─> Login (/login)
       └─> Customer Dashboard (/dashboard/customer)
           ├─> Book a JCB
           ├─> View Bookings
           └─> View Available JCBs
```

## 🎨 Key Features Implemented

### ✅ Authentication System
- User registration with role selection
- Login with email, password, and role
- Protected routes based on user role
- Session management with localStorage
- Logout functionality

### ✅ Customer Dashboard
- Welcome section with user info
- Book JCB form with validation
- Real-time availability checking
- Automatic JCB and driver assignment
- Booking management (view and cancel)
- Available JCBs display with details

### ✅ Backend APIs
- RESTful authentication endpoints
- Booking CRUD operations
- Customer-specific booking retrieval
- JCB availability checking
- Transaction management for bookings

## 🔧 Backend Structure

```
authentication/
├── controller/AuthController.java
├── service/AuthService.java
└── dto/
    ├── LoginRequest.java
    ├── RegisterRequest.java
    └── AuthResponse.java

bookingmanagement/
├── controller/BookingController.java
├── service/BookingService.java
├── model/Booking.java
├── repository/BookingRepository.java
└── strategy/
    ├── PaymentStrategy.java
    ├── CashPayment.java
    ├── CreditCardPayment.java
    └── PayPalPayment.java

usermanagement/
├── controller/CustomerController.java
├── model/ (Customer, Admin, Driver, Mechanic, Owner)
└── repository/ (for each user type)

jcbmanagement/
├── controller/JCBController.java
├── model/JCB.java
└── repository/JCBRepository.java
```

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   ├── Layout.jsx          # Navigation bar and footer
│   └── ProtectedRoute.jsx  # Route protection
├── context/
│   └── AuthContext.jsx     # Authentication state
├── pages/
│   ├── Homepage.jsx        # Landing page
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   └── CustomerDashboard.jsx  # Customer features
├── services/
│   └── api.js              # API calls
├── App.jsx                 # Main app with routing
└── main.jsx                # Entry point
```

## 🐛 Common Issues & Solutions

### Backend won't start
- ✅ Check MySQL is running
- ✅ Verify database credentials in application.properties
- ✅ Ensure Java 21 is installed

### Frontend won't start
- ✅ Run `npm install` in frontend folder
- ✅ Check Node.js is installed
- ✅ Verify port 3000 is free

### Can't create booking
- ✅ Ensure JCBs exist in database
- ✅ Ensure at least one driver exists
- ✅ Check backend console for errors
- ✅ Verify dates are valid (return > rental)

### Login fails
- ✅ Check email and password match registration
- ✅ Verify role selection matches registration role
- ✅ Check backend console for database errors

## 📞 Testing Checklist

- [ ] Can register new customer
- [ ] Registration shows success message
- [ ] Redirected to login after registration
- [ ] Can login with registered credentials
- [ ] Redirected to customer dashboard after login
- [ ] Customer info displayed correctly
- [ ] Can click "Book a JCB" button
- [ ] Booking form opens
- [ ] Can select JCB type
- [ ] Can select dates
- [ ] Can submit booking (if test data exists)
- [ ] Success message appears
- [ ] Booking appears in "My Bookings"
- [ ] Can view available JCBs
- [ ] Can cancel booking
- [ ] Can logout
- [ ] Redirected to homepage after logout

## 🎯 Next Steps

After basic testing works:
1. Create more JCB equipment via database
2. Create more drivers via database  
3. Test multiple bookings
4. Test booking cancellation
5. Implement other role dashboards
6. Add payment processing
7. Add email notifications

## 💡 Tips

- Keep both terminals (backend and frontend) running
- Check browser console for frontend errors
- Check terminal output for backend errors
- Use browser DevTools Network tab to debug API calls
- MySQL Workbench can help visualize database tables

---
**Congratulations! Your JCB Management System is ready to use!** 🎉
