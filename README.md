# dlsu-lscs-tomo-api

assume maxi sends req as id number (integer)

## TODO:
[ ] Create MySql Database to store ID number, current date, and current time
[ ] Validate if request is a valid LSCS member
  - Use LSCS Central Auth API
  - Return error/fail response if not
[ ] Validate if ID number scanned has 6 of hours since last scan
  - Return error/fail response if less than 6 hours
