/** Application roles selectable at sign-in (aligned with future API). */
export type UserRole = 'admin' | 'reviewer' | 'operator' | 'superadmin';

export const USER_ROLE_OPTIONS: ReadonlyArray<{
  value: UserRole;
  label: string;
  icon: string;
}> = [
  { value: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  { value: 'reviewer', label: 'Reviewer', icon: 'rate_review' },
  { value: 'operator', label: 'Operator', icon: 'precision_manufacturing' },
  { value: 'superadmin', label: 'SuperAdmin', icon: 'verified_user' },
];
