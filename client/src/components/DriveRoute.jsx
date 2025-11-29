import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function DriveRoute() {
  const { currentUser } = useSelector((state) => state.user);

  const allowedRoles = ['isPoliceVAn', 'isAmbulance', 'isFireTruck'];
  const hasAccess = allowedRoles.some(role => currentUser?.[role]);

  return hasAccess ? <Outlet /> : <Navigate to='/not-allowed' />;
}
