import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLES_MODE_KEY } from '../decorators/rolesMode.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Verificar o modo de validação (some = qualquer role, every = todas as roles)
    const mode =
      this.reflector.getAllAndOverride<'some' | 'every'>(ROLES_MODE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'some'; // 'some' é o padrão para compatibilidade retroativa

    if (mode === 'every') {
      // Usuário precisa ter TODAS as roles especificadas
      return requiredRoles.every((role) => user.role === role);
    }

    // Comportamento padrão (some): usuário precisa ter PELO MENOS UMA das roles
    return requiredRoles.some((role) => user.role === role);
  }
}
