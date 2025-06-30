import React, { useState } from 'react';
import permissionManager from '../configs/PermissionManager';
import { usePermissionCheck } from '../hooks/usePermissionCheck';
import PermissionGate from './PermissionGate';

/**
 * Admin Panel for managing permissions
 * Only accessible by users with role:manage permission
 */
const PermissionAdminPanel: React.FC = () => {
  const { canManageRole, roleKey } = usePermissionCheck();
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [showStats, setShowStats] = useState(false);

  // Get permission data
  const roles = permissionManager.getRoles();
  const stats = permissionManager.getStats();
  const categories = permissionManager.getCategories();
  const selectedRoleData = permissionManager.getRole(selectedRole);

  // Manual reload function
  const handleReload = () => {
    window.location.reload();
  };

  if (!canManageRole()) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
        <p className="text-red-600">You don't have permission to manage roles and permissions.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permission Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <button
            onClick={handleReload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            🔄 Reload Config
          </button>
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User</h2>
        <p><strong>Role:</strong> {roleKey}</p>
        <p><strong>Can Manage Roles:</strong> {canManageRole() ? '✅ Yes' : '❌ No'}</p>
      </div>

      {/* Statistics */}
      {showStats && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">System Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-blue-600">{stats.totalRoles}</div>
              <div className="text-sm text-gray-600">Total Roles</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-green-600">{stats.totalPermissions}</div>
              <div className="text-sm text-gray-600">Total Permissions</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-purple-600">{stats.totalCategories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-orange-600">
                {selectedRoleData?.permissions.length || 0}
              </div>
              <div className="text-sm text-gray-600">Selected Role Permissions</div>
            </div>
          </div>
        </div>
      )}

      {/* Role Selector */}
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Select Role to View</h2>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(roles).map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded border ${
                selectedRole === role
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Role Details */}
      {selectedRoleData && (
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Role Details
          </h2>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">{selectedRoleData.description}</p>
            <p className="text-sm text-gray-500">
              Total Permissions: {selectedRoleData.permissions.length}
            </p>
          </div>

          {/* Permissions by Category */}
          <div className="space-y-4">
            {categories.map(category => {
              const categoryPermissions = selectedRoleData.permissions.filter(
                permission => permission.startsWith(`${category}:`)
              );

              if (categoryPermissions.length === 0) return null;

              return (
                <div key={category} className="border rounded p-3">
                  <h3 className="font-semibold text-gray-800 mb-2 capitalize">
                    {category} ({categoryPermissions.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {categoryPermissions.map(permission => (
                      <div
                        key={permission}
                        className="bg-green-50 border border-green-200 rounded px-2 py-1 text-sm"
                      >
                        <span className="font-mono text-green-800">{permission}</span>
                        <div className="text-xs text-green-600 mt-1">
                          {permissionManager.getPermissionDescription(permission)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Role Comparison */}
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Role Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Permissions</th>
                <th className="px-4 py-2 text-left">Admin Access</th>
              </tr>
            </thead>
            <tbody>
              {stats.roleStats.map(roleStat => (
                <tr key={roleStat.role} className="border-t">
                  <td className="px-4 py-2 font-semibold capitalize">{roleStat.role}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{roleStat.description}</td>
                  <td className="px-4 py-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {roleStat.permissionCount}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {permissionManager.canAccessAdmin(roleStat.role) ? (
                      <span className="text-green-600">✅ Yes</span>
                    ) : (
                      <span className="text-red-600">❌ No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">How to Update Permissions</h2>
        <div className="text-yellow-700 space-y-2">
          <p>1. Edit the <code className="bg-yellow-100 px-1 rounded">src/configs/permissions.json</code> file</p>
          <p>2. In development: Changes will auto-reload</p>
          <p>3. In production: Click the "Reload Config" button or restart the application</p>
          <p>4. Use the Permission Examples page to test your changes</p>
        </div>
      </div>
    </div>
  );
};

export default PermissionAdminPanel;
