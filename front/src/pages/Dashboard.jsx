import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Entries from './Entries';

export default function Dashboard() {
  const { currentUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // wait until auth is known
    if (authLoading) return;

    // no user → stop loading
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // fetch profile from /users/profile
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, authLoading]);

  // still waiting for auth or profile
  if (authLoading || loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }
  // error fetching profile
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {profile?.name || currentUser.email}
      </h1>
      <p className="mb-6">Your role: {profile?.role}</p>

      <Entries />
    </div>
  );
}