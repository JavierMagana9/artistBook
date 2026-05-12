import Entries from './Entries';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { currentUser, userData, profileError } = useAuth();
  const displayName = userData?.name || currentUser?.displayName || currentUser?.email || 'Artist';
  const profileStatus = profileError?.response?.status;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Welcome, {displayName}
        </h1>
        {userData?.role && !userData?.isFallback && (
          <p className="text-base sm:text-lg text-gray-600">
            Role: <span className="font-medium text-indigo-600">{userData.role}</span>
          </p>
        )}
        {profileError && (
          <p role="status" className="mt-3 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
            We could not sync your backend profile{profileStatus ? ` (status ${profileStatus})` : ''},
            but you are signed in with Firebase. Some account-specific data may be limited until the API profile route responds.
          </p>
        )}
      </header>

      <section aria-labelledby="entries-section">
        <h2 id="entries-section" className="sr-only">Your Entries</h2>
        <Entries />
      </section>
    </div>
  );
}
