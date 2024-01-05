import React from 'react'
import ProfileCard from '../../../components/Owner/ProfileCard/ProfileCard'
import { useLocation } from 'react-router-dom'
import { generateError } from '../../../components/Dependencies/toast';

const ProfilePage = () => {

  const location = useLocation();
  const kyc = location.state || false;

  if (kyc.kycAdded) {
    generateError('Please add KYC before adding properties')
  }

  return (
    <>
      <ProfileCard/>
    </>
  )
}

export default ProfilePage
