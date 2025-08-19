Golden Rule:
Always treat user inputs as being in a specific timezone (e.g. Europe/Rome), and convert them to UTC before storing.

- change email sender in send-reset-password-email
- check zod v4 use everywhere
- security check on routes and funcions?
- add error layouts
- add not found layouts
- add metatags for each layout/page
- check all restrict or cascade keys in db

- switch socials to table
- isArtist flag or component duplication
- manager block button refactor
- updates enitities in others join table only if data is dirty
- an artist can have 0 managers -> mo manager
- artist social data batch of 4 or nothing
- create subfolders for upload based on entity
- check server actions structure: auth - validation - action
- upload image check, loading state, error messages
- create indexes on database tables
- check for timestamp in the db for timezone
- mettere size su tutte le icone nelle classi
- refactor all components to externalize props
- inside the triggers of popover and stuff remove buttons if not usefull
- aggiungere trim su tutte le validationi stringa tranne password
- uniform badges UI
- custom select and button in form UI
- format function, add locale everiwhere
- transitions sui filtri
- aggiungere sulle tabelle db gli index (
  create index if not exists idx_events_availability_id on public.events (availability_id);
  create index if not exists idx_events_status on public.events (status);
  )
- check optional values inside schemas (take example in event schema)

- managers possono essere visualizzati anche se non ancora approvati?
- in tabella no, mettere sezione accetta anche su relativa pgina

- flusso status eventi e disponibilità?
  --- conflict solo su disponibilità artista

- se cancello disponibilità di un artista che è collegata ad un evento?
  --- si può cancellare solo se ha collegati proposti, rifiutati

input - text-sm font-normal
placeholder - text-zinc-500
value

dashboard--

calendario toolbar,
event content
