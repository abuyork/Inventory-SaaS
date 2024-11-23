import { UserProfile } from '../components/settings/UserProfile';
// ... other imports

export default function Settings() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      
      <div className="grid gap-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">User Profile</h3>
          <UserProfile />
        </section>
        
        {/* Add other settings sections here */}
      </div>
    </div>
  );
} 