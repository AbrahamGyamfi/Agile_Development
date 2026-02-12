import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
    
    // Listen for auth events to update role when user signs in
    const listener = Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signIn') {
        checkUser();
      }
    });

    return () => listener();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      
      // Get user's Cognito groups from JWT token (most reliable method)
      const session = await Auth.currentSession();
      const groups = session.getIdToken().payload['cognito:groups'] || [];
      
      // Check if user is in admin group (groups are lowercase: 'admin', 'member')
      if (groups.includes('admin')) {
        setUserRole('admin');
        console.log('User role set to: admin (from Cognito groups)');
      } else if (groups.includes('member')) {
        setUserRole('member');
        console.log('User role set to: member (from Cognito groups)');
      } else {
        // Fallback: Only abraham.gyamfi@amalitech.com is admin
        const email = currentUser.attributes?.email || '';
        if (email.toLowerCase() === 'abraham.gyamfi@amalitech.com') {
          setUserRole('admin');
          console.log('User role set to: admin (from email check)');
        } else {
          setUserRole('member');
          console.log('User role set to: member (default)');
        }
      }
      
      return currentUser;
    } catch (error) {
      console.log('No user signed in');
      setError('Please sign in to continue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setUserRole('member');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  return {
    user,
    userRole,
    loading,
    error,
    setError,
    checkUser,
    handleSignOut
  };
};
