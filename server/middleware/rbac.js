export const checkPermission = (moduleName, action) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !user.role) {
        return res.status(401).json({
          success: false,
          message: 'Access denied: User is not authenticated.',
          data: null
        });
      }

      const roleName = user.role.name;

      // 'Founder' has super admin access across all modules
      if (roleName === 'Founder') {
        return next();
      }

      // 'CEO' has super admin access except for financial data
      const financialModules = [
        'invoices',
        'commission-records',
        'commission-structures',
        'payrolls',
        'targets',
        'petty-cash',
        'sales',
        'revenue'
      ];

      if (roleName === 'CEO') {
        if (financialModules.includes(moduleName.toLowerCase())) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: CEO has no access to financial data.',
            data: null
          });
        }
        return next();
      }

      const permissions = user.role.permissions || [];
      
      // Find matching module permission
      const modulePermission = permissions.find(
        (p) => p.module.toLowerCase() === moduleName.toLowerCase() || p.module === '*'
      );

      if (!modulePermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied: No permissions configured for module '${moduleName}'.`,
          data: null
        });
      }

      // Check if action (or wildcard '*') is allowed
      const hasAction = modulePermission.actions.includes(action) || modulePermission.actions.includes('*');

      if (!hasAction) {
        return res.status(403).json({
          success: false,
          message: `Access denied: You are not authorized to perform action '${action}' on module '${moduleName}'.`,
          data: null
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
