Golden Rule:
Always treat user inputs as being in a specific timezone (e.g. Europe/Rome), and convert them to UTC in the Frontend.

- frontend use timezoned (e.g. Europe/Rome)
- as soon as possible in the FE convert the dates in UTC
- pass the data in UTC to the backend
- the BE responds in UTC to the FE
- the FE convert to timezone and display

- change email sender in send-reset-password-email
- create subfolders for upload based on entity
- add loading pages
- validation on input filters
- check for timestamp in the db for timezone
- format function, add locale everiwhere
- transitions sui filtri
- general fetches in the pages: cache and errors?

- review all availability system and timezones UTC.. kkepp goingggg
