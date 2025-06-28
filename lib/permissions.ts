import { createAccessControl, Statements } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statement: Statements = {
  ...defaultStatements,
  project: ['create', 'read', 'update', 'delete', 'update:own', 'delete:own'],
} as const;

export const ac = createAccessControl(statement);
export const userRole = ac.newRole({ project: ['read'] });
export const adminRole = ac.newRole({
  ...adminAc.statements,
  project: ['create', 'read', 'update', 'delete', 'update:own', 'delete:own'],
});
export const artistManagerRole = ac.newRole({
  project: ['create', 'read', 'update:own', 'delete:own'],
});
export const venueManagerRole = ac.newRole({
  project: ['create', 'read', 'update:own', 'delete:own'],
});

export const adminConfig = {
  roles: {
    'user': userRole,
    'admin': adminRole,
    'artist-manager': artistManagerRole,
    'venue-manager': venueManagerRole,
  },
  defaultRole: 'user',
  adminRoles: ['admin'],
};
