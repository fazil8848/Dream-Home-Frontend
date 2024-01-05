import React from 'react'
import OwnerDashboard from '../../../components/Owner/DashBoard/OwnerDashboard'
import { useLocation } from 'react-router-dom';
import { generateError } from '../../../components/Dependencies/toast';

function OwnerHome() {

  const location = useLocation();
  const kyc = location.state || false;

  if (kyc.kycApproved) {
    generateError('Please wait till the kyc is Approved')
  }
  return (
    <div>
      <OwnerDashboard/>
    </div>
  )
}

export default OwnerHome