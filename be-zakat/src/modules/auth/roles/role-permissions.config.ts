import { UserRole } from "@prisma/client";
import { Permission } from "./permissions.enum";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.JAMAAH]: [
        Permission.TRANSACTION_READ,
        Permission.TRANSACTION_WRITE,
    ],

    [UserRole.PENGURUS]: [
        Permission.USER_READ,
        Permission.TRANSACTION_READ,
        Permission.TRANSACTION_WRITE,
        Permission.TRANSACTION_VERIFY,
    ],

    [UserRole.BENDAHARA]: [
        Permission.USER_READ,
        Permission.TRANSACTION_READ,
        Permission.TRANSACTION_WRITE,
        Permission.TRANSACTION_VERIFY,
        Permission.REPORT_READ,
        Permission.REPORT_EXPORT,
    ],

    [UserRole.SUPER_ADMIN]: [
        Permission.USER_READ,
        Permission.TRANSACTION_READ,
        Permission.TRANSACTION_WRITE,
        Permission.TRANSACTION_VERIFY,
        Permission.REPORT_READ,
        Permission.REPORT_EXPORT,
        Permission.SYSTEM_CONFIG,
    ]

};

export const hasPermission = (role: UserRole, permissions: Permission): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permissions) || false;
}

export const getPermissionByRole = (role: UserRole): Permission[] => {
    return ROLE_PERMISSIONS[role] || [];
}