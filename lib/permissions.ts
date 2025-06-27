import { createAccessControl, Statements } from 'better-auth/plugins/access';

const statement: Statements = {
  project: ['create', 'read', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);
export const userRole = ac.newRole({ project: ['read'] });
export const adminRole = ac.newRole({
  project: ['create', 'read', 'update', 'delete'],
});
export const artistManagerRole = ac.newRole({
  project: ['create', 'read', 'update'],
});
export const venueManagerRole = ac.newRole({
  project: ['create', 'read', 'update'],
});
