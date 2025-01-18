# lscs-tomo-api

This repository handles the backend for validating LSCS Members via barcode scanning. 

For Tomo Coffee use: to check if user is a LSCS Members, thus eligible for a discount.

## Requirements
1. Requests are assumed as ID numbers (integer).

## Features
- **MySQL Database**
  - Stores the ID number, current date, and current time of each scan.
- **Validation**
  - Checks if the request is from a valid LSCS member using the LSCS Central Auth API.
  - Returns an error/fail response if the ID is invalid.
- **Time Restriction**
  - Ensures a minimum of 6 hours has elapsed since the last scan for the same ID number.
  - Returns an error/fail response if less than 6 hours have passed.

## TODO
- [ ] **Database Setup**
  - Create a MySQL database to store:
    - ID number
    - Current date
    - Current time
- [ ] **Validation**
  - Integrate with the LSCS Central Auth API to check membership validity.
  - Return appropriate error responses for invalid IDs.
- [ ] **Time Restriction Logic**
  - Check the timestamp of the last scan for the given ID number.
  - Ensure at least 6 hours have passed before allowing a new scan.
  - Return error/fail response if the time condition is not met.
