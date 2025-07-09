
export const requireRole = (...allowedRoles) => {

    return (req, res, next) => {

      console.log('Usuario Autenticado: ', req.user);

      const userRole = req.user?.role;

      console.log('Rol del usuario: ', userRole);
      console.log('Roles permitidos: ', allowedRoles);

      
      if (!userRole || !allowedRoles.includes(userRole)) {
        
        return res.status(403).json({ msg: 'Acceso denegado: rol no autorizado' });
      }
      next();
    };
  };
  