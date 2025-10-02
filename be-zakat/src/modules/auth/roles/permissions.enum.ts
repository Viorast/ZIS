export enum Permission {
    // User Managemnet
    USER_READ = 'user:read',
    USER_WRITE = 'user:write',

    // Transaction Management
    TRANSACTION_READ = 'transaction:read',
    TRANSACTION_WRITE = 'transaction:write',
    TRANSACTION_VERIFY = 'transaction:verify',

    // financial report
    REPORT_READ = 'report:read',
    REPORT_EXPORT = 'report:export',

    // System Settings
    SYSTEM_CONFIG = 'system:config',
}