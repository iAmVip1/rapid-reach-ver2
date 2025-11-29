import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function DepartmentRoute() {
  const { currentUser } = useSelector((state) => state.user);

  const allowedRoles = ['isHospital', 'isFireDep', 'isPoliceDep', 'isBlood'];
  const hasAccess = allowedRoles.some(role => currentUser?.[role]);

  return hasAccess ? <Outlet /> : <Navigate to='/not-allowed' />;
}
