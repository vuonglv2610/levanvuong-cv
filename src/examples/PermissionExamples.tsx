import React from 'react';
import PermissionGate from '../components/PermissionGate';
import { usePermissionCheck } from '../hooks/usePermissionCheck';

/**
 * Examples demonstrating how to use the permission system
 */
const PermissionExamples: React.FC = () => {
  const {
    canCreateProduct,
    canDeleteProduct,
    canUpdateProduct,
    canViewProduct,
    canCreateUser,
    canDeleteUser,
    roleKey,
    hasPermission,
    getRoleInfo
  } = usePermissionCheck();

  const roleInfo = getRoleInfo();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Permission System Examples</h1>
      
      {/* Role Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User Role</h2>
        <p><strong>Role:</strong> {roleKey}</p>
        <p><strong>Description:</strong> {roleInfo?.description}</p>
        <p><strong>Total Permissions:</strong> {roleInfo?.permissions.length}</p>
      </div>

      {/* Product Management Examples */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Product Management</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* View Products - All roles can see this */}
          <PermissionGate permission="product:view">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              View Products
            </button>
          </PermissionGate>

          {/* Create Product - Only admin */}
          <PermissionGate 
            permission="product:create"
            fallback={
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
                Create Product (No Permission)
              </button>
            }
          >
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Create Product
            </button>
          </PermissionGate>

          {/* Update Product - Admin and User */}
          <PermissionGate permission="product:update">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Update Product
            </button>
          </PermissionGate>

          {/* Delete Product - Only admin */}
          <PermissionGate 
            permission="product:delete"
            fallback={
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
                Delete Product (No Permission)
              </button>
            }
          >
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Delete Product
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* User Management Examples */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">User Management</h2>
        
        {/* Only Admin can see user management */}
        <PermissionGate 
          role="admin"
          fallback={
            <p className="text-gray-500 italic">User management is only available for administrators.</p>
          }
        >
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              View Users
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Create User
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Delete User
            </button>
          </div>
        </PermissionGate>
      </div>

      {/* Multiple Permissions Example */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Advanced Permission Checks</h2>
        
        {/* Require ALL permissions (AND logic) */}
        <PermissionGate 
          permissions={['product:create', 'product:delete']}
          requireAll={true}
          fallback={<p className="text-red-500">Need both create AND delete permissions</p>}
        >
          <div className="bg-green-100 p-3 rounded mb-4">
            <p className="text-green-800">You have full product management permissions!</p>
          </div>
        </PermissionGate>

        {/* Require ANY permission (OR logic) */}
        <PermissionGate 
          permissions={['product:update', 'product:view']}
          requireAll={false}
          fallback={<p className="text-red-500">Need either update OR view permissions</p>}
        >
          <div className="bg-blue-100 p-3 rounded">
            <p className="text-blue-800">You can work with products!</p>
          </div>
        </PermissionGate>
      </div>

      {/* Conditional Rendering with Hooks */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Hook-based Permission Checks</h2>
        
        <div className="space-y-2">
          <p>Can create products: {canCreateProduct() ? '✅' : '❌'}</p>
          <p>Can update products: {canUpdateProduct() ? '✅' : '❌'}</p>
          <p>Can delete products: {canDeleteProduct() ? '✅' : '❌'}</p>
          <p>Can view products: {canViewProduct() ? '✅' : '❌'}</p>
          <p>Can create users: {canCreateUser() ? '✅' : '❌'}</p>
          <p>Can delete users: {canDeleteUser() ? '✅' : '❌'}</p>
          <p>Has analytics permission: {hasPermission('analytics:view') ? '✅' : '❌'}</p>
        </div>
      </div>

      {/* Role-specific Content */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Role-specific Content</h2>
        
        <PermissionGate role="admin">
          <div className="bg-red-100 p-3 rounded mb-2">
            <p className="text-red-800">🔥 Admin-only content: Full system access</p>
          </div>
        </PermissionGate>

        <PermissionGate role="user">
          <div className="bg-yellow-100 p-3 rounded mb-2">
            <p className="text-yellow-800">⚡ User-only content: Limited admin access</p>
          </div>
        </PermissionGate>

        <PermissionGate role="customer">
          <div className="bg-green-100 p-3 rounded">
            <p className="text-green-800">🛍️ Customer-only content: Shopping features</p>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
};

export default PermissionExamples;
