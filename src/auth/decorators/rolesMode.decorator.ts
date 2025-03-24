import { SetMetadata } from '@nestjs/common';

export const ROLES_MODE_KEY = 'roles_mode';
export const RolesMode = (mode: 'some' | 'every') =>
  SetMetadata(ROLES_MODE_KEY, mode);
