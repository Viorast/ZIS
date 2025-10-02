import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Permission } from 'src/modules/auth/roles/permissions.enum';
import { ROLE_PERMISSIONS } from 'src/modules/auth/roles/role-permissions.config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );

    // Jika tidak ada permission requirement, allow access
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Check semua required permissions
    return requiredPermissions.every(permission => 
      ROLE_PERMISSIONS[user.role]?.includes(permission)
    );
  }
}