# Troubleshooting Guide - JCB Management System

## Common Issues and Solutions

### 🔴 Backend Issues

#### Issue 1: Backend won't start - Port 8080 already in use
**Symptoms:**
```
Web server failed to start. Port 8080 was already in use.
```

**Solutions:**
1. Find and kill the process using port 8080:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Alternative: Change the port in application.properties
server.port=8081
```

#### Issue 2: Cannot connect to database
**Symptoms:**
```
Communications link failure
Access denied for user 'root'@'localhost'
```

**Solutions:**
1. Verify MySQL is running:
```bash
# Windows - Check services
services.msc
# Look for MySQL80 or MySQL service
```

2. Check credentials in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jcb_management
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Test MySQL connection:
```sql
mysql -u root -p
SHOW DATABASES;
USE jcb_management;
```

#### Issue 3: Table doesn't exist errors
**Symptoms:**
```
Table 'jcb_management.customer' doesn't exist
```

**Solutions:**
1. Ensure `spring.jpa.hibernate.ddl-auto=update` in application.properties
2. Delete database and let Hibernate recreate:
```sql
DROP DATABASE jcb_management;
CREATE DATABASE jcb_management;
```
3. Restart backend - tables will be auto-created

#### Issue 4: Java version mismatch
**Symptoms:**
```
Unsupported major.minor version
```

**Solutions:**
1. Check Java version:
```bash
java -version
# Should show version 21.x.x
```

2. Set JAVA_HOME environment variable:
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-21
```

---

### 🔵 Frontend Issues

#### Issue 5: npm install fails
**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**
1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

3. Use alternate registry:
```bash
npm install --registry=https://registry.npmjs.org/
```

#### Issue 6: Frontend won't start - Port 3000 in use
**Symptoms:**
```
Port 3000 is in use
```

**Solutions:**
1. Kill process on port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

2. Or use different port in vite.config.js:
```javascript
export default defineConfig({
  server: {
    port: 3001,  // Changed from 3000
  }
})
```

#### Issue 7: Module not found errors
**Symptoms:**
```
Cannot find module 'react'
Cannot find module 'axios'
```

**Solutions:**
1. Ensure you're in the frontend directory:
```bash
cd frontend
npm install
```

2. Check package.json exists and has dependencies

3. Reinstall specific package:
```bash
npm install react react-dom
npm install axios
```

#### Issue 8: Blank white screen
**Symptoms:**
- Browser shows blank page
- Console shows errors

**Solutions:**
1. Check browser console (F12) for errors
2. Verify all components are imported correctly
3. Check if backend is running
4. Clear browser cache
5. Try incognito/private mode

---

### 🟡 API Connection Issues

#### Issue 9: CORS errors
**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Verify backend CORS configuration in `CorsConfig.java`
2. Check frontend API base URL in `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

3. Ensure backend is running on port 8080

#### Issue 10: 404 Not Found errors
**Symptoms:**
```
GET http://localhost:8080/api/auth/login 404 (Not Found)
```

**Solutions:**
1. Check backend console for startup errors
2. Verify endpoint exists in controller
3. Check request URL matches controller mapping
4. Verify `@RestController` and `@RequestMapping` annotations

#### Issue 11: Network Error / Cannot connect
**Symptoms:**
```
Network Error
ERR_CONNECTION_REFUSED
```

**Solutions:**
1. Verify backend is running:
```bash
# Should see Spring Boot ASCII art and "Started JcbManagementSystemBackendApplication"
```

2. Check backend URL in browser:
```
http://localhost:8080/api/auth/login
# Should see 405 Method Not Allowed (not 404)
```

3. Check proxy configuration in vite.config.js

---

### 🟢 Database Issues

#### Issue 12: No JCBs available for booking
**Symptoms:**
- Booking form shows "No JCBs available"
- Cannot create booking

**Solutions:**
1. Add test JCB data:
```sql
-- First create owner
INSERT INTO owner (nic, first_name, last_name, email, password)
VALUES ('owner123', 'Test', 'Owner', 'owner@test.com', 'password');

-- Then create JCB
INSERT INTO jcb (registered_number, engine_number, jcb_type, rental_price, is_available, owner_nic)
VALUES ('JCB001', 'ENG001', 'Excavator', 500.00, 1, 'owner123');
```

2. Check JCB availability:
```sql
SELECT * FROM jcb WHERE is_available = 1;
```

#### Issue 13: No drivers available
**Symptoms:**
```
Error: No available drivers found
```

**Solutions:**
1. Add test driver:
```sql
INSERT INTO driver (nic, first_name, last_name, email, password, is_available)
VALUES ('driver123', 'Test', 'Driver', 'driver@test.com', 'password', 1);
```

2. Check driver availability:
```sql
SELECT * FROM driver WHERE is_available = 1;
```

3. Release unavailable drivers:
```sql
UPDATE driver SET is_available = 1;
```

#### Issue 14: Duplicate entry errors
**Symptoms:**
```
Duplicate entry 'test@email.com' for key 'email'
Duplicate entry '123456789V' for key 'PRIMARY'
```

**Solutions:**
1. Use unique email addresses
2. Use unique NIC numbers
3. Check existing data:
```sql
SELECT * FROM customer WHERE email = 'test@email.com';
SELECT * FROM customer WHERE nic = '123456789V';
```

---

### 🟣 Login/Registration Issues

#### Issue 15: Registration successful but login fails
**Symptoms:**
- Registration shows success
- Login with same credentials fails

**Solutions:**
1. Verify role matches:
   - Registration role: CUSTOMER
   - Login role: CUSTOMER (must match)

2. Check database:
```sql
SELECT * FROM customer WHERE email = 'your@email.com';
-- Verify password matches
```

3. Check for typos in email/password

#### Issue 16: "User already exists" error
**Symptoms:**
```
User with this email or NIC already exists
```

**Solutions:**
1. Use different email address
2. Use different NIC number
3. Or delete existing user:
```sql
DELETE FROM customer WHERE email = 'test@email.com';
```

#### Issue 17: Cannot access dashboard after login
**Symptoms:**
- Login successful
- Redirected to homepage instead of dashboard

**Solutions:**
1. Check browser console for errors
2. Verify role-based routing in App.jsx
3. Check localStorage:
```javascript
// In browser console
localStorage.getItem('user')
localStorage.getItem('userRole')
```

4. Clear localStorage and login again:
```javascript
localStorage.clear()
```

---

### 🔴 Booking Issues

#### Issue 18: Booking fails with validation error
**Symptoms:**
```
Error: Invalid rental or return date
Error: Price and terms must be accepted
```

**Solutions:**
1. Ensure return date is after rental date
2. Check both checkboxes:
   - ✅ Accept rental price
   - ✅ Accept terms and conditions
3. Select valid dates (not in the past)

#### Issue 19: Booking created but not showing
**Symptoms:**
- Success message appears
- Booking not in "My Bookings" table

**Solutions:**
1. Refresh the page
2. Check database:
```sql
SELECT * FROM bookings WHERE customer_id = 'YOUR_NIC';
```

3. Check browser console for errors
4. Verify API call in Network tab (F12)

#### Issue 20: Cannot cancel booking
**Symptoms:**
- Cancel button not working
- Error when canceling

**Solutions:**
1. Check browser console for errors
2. Verify booking ID exists:
```sql
SELECT * FROM bookings WHERE id = 1;
```

3. Check backend logs for errors

---

### 🛠️ Development Tools

#### Useful Browser Developer Tools Commands

**Check Authentication State:**
```javascript
// In browser console
localStorage.getItem('user')
localStorage.getItem('userRole')
```

**Clear Authentication:**
```javascript
localStorage.clear()
```

**Test API Endpoints:**
```javascript
// In browser console
fetch('http://localhost:8080/api/bookings/customer/123456789V')
  .then(r => r.json())
  .then(console.log)
```

#### Useful MySQL Commands

**View all tables:**
```sql
SHOW TABLES;
```

**Check table structure:**
```sql
DESCRIBE customer;
DESCRIBE jcb;
DESCRIBE bookings;
```

**View all data:**
```sql
SELECT * FROM customer;
SELECT * FROM jcb;
SELECT * FROM driver;
SELECT * FROM bookings;
```

**Reset availability:**
```sql
UPDATE jcb SET is_available = 1;
UPDATE driver SET is_available = 1;
```

**Delete all bookings:**
```sql
DELETE FROM bookings;
```

**Delete all users:**
```sql
DELETE FROM customer;
DELETE FROM admin;
DELETE FROM driver;
DELETE FROM mechanic;
DELETE FROM owner;
```

---

### 📊 Debugging Checklist

When something doesn't work, check in this order:

1. **Backend**
   - [ ] MySQL is running
   - [ ] Database exists
   - [ ] Backend application started successfully
   - [ ] No errors in backend console
   - [ ] Port 8080 is accessible

2. **Frontend**
   - [ ] npm install completed
   - [ ] Frontend dev server running
   - [ ] No errors in browser console
   - [ ] Port 3000 is accessible

3. **Database**
   - [ ] Tables exist (auto-created by Hibernate)
   - [ ] Test data exists (owners, JCBs, drivers)
   - [ ] No duplicate key errors

4. **API Connection**
   - [ ] CORS configured correctly
   - [ ] Proxy working in Vite
   - [ ] Network requests succeeding (check Network tab)
   - [ ] Correct API base URL

5. **Authentication**
   - [ ] User registered successfully
   - [ ] Role matches between registration and login
   - [ ] User data in localStorage
   - [ ] Protected routes working

---

### 🆘 Emergency Reset

If everything is broken, do a complete reset:

```bash
# 1. Stop all servers
# Ctrl+C on both frontend and backend terminals

# 2. Reset database
mysql -u root -p
DROP DATABASE jcb_management;
CREATE DATABASE jcb_management;
exit;

# 3. Clean frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# 4. Clean backend
cd ..
mvnw.cmd clean

# 5. Start backend
mvnw.cmd spring-boot:run

# 6. Start frontend (in new terminal)
cd frontend
npm run dev

# 7. Clear browser data
# - Clear localStorage
# - Clear cookies
# - Hard refresh (Ctrl+Shift+R)
```

---

### 📞 Getting Help

If issues persist:

1. **Check Backend Logs**
   - Look for errors in the terminal running Spring Boot
   - Look for startup errors
   - Check for SQL errors

2. **Check Frontend Logs**
   - Open browser Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Check Database**
   - Verify tables exist
   - Check data integrity
   - Look for constraint violations

4. **Review Documentation**
   - README.md - Full documentation
   - QUICK_START.md - Setup guide
   - ARCHITECTURE.md - System design

5. **Common Error Patterns**
   - 404 errors → Check URL and controller mappings
   - 500 errors → Check backend logs
   - CORS errors → Check CORS configuration
   - Blank screen → Check browser console
   - Login fails → Check role matches

---

### ✅ Verification Steps

**Backend is working if:**
```bash
# You see this in terminal:
Started JcbManagementSystemBackendApplication in X seconds

# And this URL works in browser:
http://localhost:8080
```

**Frontend is working if:**
```bash
# You see this in terminal:
Local: http://localhost:3000/

# And homepage loads in browser:
http://localhost:3000
```

**Database is working if:**
```sql
USE jcb_management;
SHOW TABLES;
-- Shows: admin, customer, driver, jcb, mechanic, owner, bookings
```

---

**Remember:** Most issues are caused by:
1. Services not running (MySQL, backend, frontend)
2. Missing test data (JCBs, drivers)
3. Port conflicts
4. Incorrect configuration

Always check these first! 🔍
