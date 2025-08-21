Golden Rule:
Always treat user inputs as being in a specific timezone (e.g. Europe/Rome), and convert them to UTC before storing.

- change email sender in send-reset-password-email
- create subfolders for upload based on entity

- create indexes on database tables

- check for timestamp in the db for timezone

- format function, add locale everiwhere
- transitions sui filtri

- aggiungere sulle tabelle db gli index (
  create index if not exists idx_events_availability_id on public.events (availability_id);
  create index if not exists idx_events_status on public.events (status);
  )

- general fetches in the pages: cache and errors?
- review all availability system and timezones UTC..

- se cancello disponibilità di un artista che è collegata ad un evento?
  --- si può cancellare solo se ha collegati proposti, rifiutati
