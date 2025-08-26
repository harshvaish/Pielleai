Golden Rule for Dates & Timezones

Always interpret user inputs in the business timezone (e.g. Europe/Rome) and convert them to UTC as early as possible in the Frontend.
All communication between Frontend and Backend happens in UTC.

WORKFLOW

Frontend (FE)
Work in the business timezone for all user interactions (date pickers, calendars, forms).
Immediately convert inputs to UTC once captured.
Send only UTC values to the backend.

Backend (BE)
Accept and store UTC values exclusively.
Perform all queries and computations in UTC.
Return responses in UTC.

Frontend (FE)
Convert received UTC values back to the business timezone for display.
@@@@@@@@@@@@@@@@@@@@@@@@

- change email sender in send-reset-password-email
- rls on database
- create subfolders for upload based on entity
- transitions sui filtri
- general fetches in the pages: cache
- add swr options
- genders enum shouls be in english in db
- all api should have auth and validation of params
