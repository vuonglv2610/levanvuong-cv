import React from 'react';
import { usePermissionCheck } from '../../hooks/usePermissionCheck';
import PermissionGate from '../../components/PermissionGate';
import PermissionButton from '../../components/PermissionButton';

const PermissionTestPage: React.FC = () => {
  const { roleKey, hasPermission, getUserPermissions } = usePermissionCheck();
  const userPermissions = getUserPermissions();

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">🔐 Permission System Test</h1>
        
        {/* Current User Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Current User Info</h2>
          <p><strong>Role:</strong> {roleKey || 'Not logged in'}</p>
          <p><strong>Total Permissions:</strong> {userPermissions.length}</p>
          <div className="mt-2">
            <strong>Permissions:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {userPermissions.map(permission => (
                <span key={permission} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Management Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📦 Product Management</h3>
            <div className="space-y-2">
              <PermissionGate 
                permission="product:view"
                fallback={<p className="text-red-500 text-sm">❌ No view permission</p>}
              >
                <p className="text-green-600 text-sm">✅ Can view products</p>
              </PermissionGate>

              <PermissionButton
                permission="product:create"
                className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Create Product (No Permission)</button>}
              >
                Create Product
              </PermissionButton>

              <PermissionButton
                permission="product:update"
                className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Update Product (No Permission)</button>}
              >
                Update Product
              </PermissionButton>

              <PermissionButton
                permission="product:delete"
                className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Delete Product (No Permission)</button>}
              >
                Delete Product
              </PermissionButton>
            </div>
          </div>

          {/* Category Management Tests */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">📂 Category Management</h3>
            <div className="space-y-2">
              <PermissionGate 
                permission="category:view"
                fallback={<p className="text-red-500 text-sm">❌ No view permission</p>}
              >
                <p className="text-green-600 text-sm">✅ Can view categories</p>
              </PermissionGate>

              <PermissionButton
                permission="category:create"
                className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Create Category (No Permission)</button>}
              >
                Create Category
              </PermissionButton>

              <PermissionButton
                permission="category:update"
                className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Update Category (No Permission)</button>}
              >
                Update Category
              </PermissionButton>

              <PermissionButton
                permission="category:delete"
                className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Delete Category (No Permission)</button>}
              >
                Delete Category
              </PermissionButton>
            </div>
          </div>

          {/* User Management Tests */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">👥 User Management</h3>
            <div className="space-y-2">
              <PermissionGate 
                permission="user:view"
                fallback={<p className="text-red-500 text-sm">❌ No view permission</p>}
              >
                <p className="text-green-600 text-sm">✅ Can view users</p>
              </PermissionGate>

              <PermissionButton
                permission="user:create"
                className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Create User (No Permission)</button>}
              >
                Create User
              </PermissionButton>

              <PermissionButton
                permission="user:update"
                className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Update User (No Permission)</button>}
              >
                Update User
              </PermissionButton>

              <PermissionButton
                permission="user:delete"
                className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm"
                fallback={<button className="w-full bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">Delete User (No Permission)</button>}
              >
                Delete User
              </PermissionButton>
            </div>
          </div>
        </div>

        {/* Role Management Test */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h3 className="font-semibold mb-3">⚙️ Role Management</h3>
          <PermissionGate 
            permission="role:manage"
            fallback={
              <div className="text-red-500">
                <p>❌ You don't have permission to manage roles</p>
                <p className="text-sm">Only admin users can access role management</p>
              </div>
            }
          >
            <div className="text-green-600">
              <p>✅ You can manage roles and permissions</p>
              <PermissionButton
                permission="role:manage"
                type="link"
                to="/admin/permissions"
                className="inline-block mt-2 bg-purple-500 text-white px-4 py-2 rounded"
              >
                Go to Permission Management
              </PermissionButton>
            </div>
          </PermissionGate>
        </div>

        {/* Permission Check Results */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h3 className="font-semibold mb-3">🔍 Permission Check Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              'product:view', 'product:create', 'product:update', 'product:delete',
              'category:view', 'category:create', 'category:update', 'category:delete',
              'user:view', 'user:create', 'user:update', 'user:delete',
              'role:view', 'role:manage', 'order:view', 'analytics:view'
            ].map(permission => (
              <div key={permission} className="flex items-center justify-between">
                <span className="text-gray-700">{permission}:</span>
                <span className={hasPermission(permission) ? 'text-green-600' : 'text-red-500'}>
                  {hasPermission(permission) ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionTestPage;
