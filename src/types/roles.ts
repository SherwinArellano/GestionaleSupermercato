export const RoleValues = ['admin', 'manager', 'cashier'] as const;

export type Role = (typeof RoleValues)[number];
