import { useAuthProvider } from 'contexts/AuthContext';
import { useToast } from 'hooks/useToast';
import React, { useRef, useState } from 'react';

const ProfilePage = () => {
  const { userInfo, isLoading, refreshProfile } = useAuthProvider();
  const toast = useToast();

  // Fetch customer statistics
  const profileData = userInfo?.result?.data;
  const isCustomer = profileData?.accountType === 'customer';

  // Import hook dynamically to avoid issues
  const useCustomerStats = require('hooks/useCustomerStats').useCustomerStats;

  const { data: customerStats, isLoading: statsLoading, error: statsError, stats } = useCustomerStats(
    isCustomer,
    profileData?.id
  );

  // Handle success/error with toast and logging
  React.useEffect(() => {
    if (statsError) {
      console.error('❌ Customer statistics error:', statsError);
      toast.error('Lỗi thống kê', 'Không thể tải thống kê tài khoản');
    }
  }, [statsError, toast]);

  React.useEffect(() => {
    if (customerStats && !statsLoading) {
      console.log('✅ Customer statistics loaded in ProfilePage:', customerStats);
    }
  }, [customerStats, statsLoading]);

  // TODO: Uncomment khi fix được import issue
  // const { data: customerStats, isLoading: statsLoading, error: statsError } = useQuery({
  //   queryKey: ['customer-statistics-summary'],
  //   queryFn: getCustomerStatisticsSummary,
  //   enabled: isCustomer && !!profileData?.id,
  //   staleTime: 5 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  //   retry: 2,
  //   onSuccess: (data: any) => {
  //     console.log('✅ Customer statistics loaded:', data);
  //   },
  //   onError: (error: any) => {
  //     console.error('❌ Failed to fetch customer statistics:', error);
  //     toast.error('Lỗi thống kê', 'Không thể tải thống kê tài khoản');
  //   }
  // });

  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  // const [avatarBlobUrl, setAvatarBlobUrl] = useState<string>(''); // Tạm thời comment
  const hasSetFormData = useRef(false);

  // Removed old profileData to avoid confusion
  
  // Lấy thông tin role
  const roleKey = userInfo?.result?.data?.role?.role_key;
  const hasRoleId = !!userInfo?.result?.data?.roleId;
  const actualRole = hasRoleId ? roleKey : 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    google_id: '',
    avatar: '',
    accountType: '',
    createdAt: '',
    updatedAt: ''
  });

  // LOẠI BỎ HOÀN TOÀN useEffect - chỉ dùng khi cần
  // profileData đã được định nghĩa ở trên

  // Chỉ set formData khi có data và chưa set
  if (profileData?.id && !hasSetFormData.current && profileData.name) {
    console.log('Setting form data ONCE for user:', profileData.id);

    // Avatar is now working after backend fix
    if (profileData.avatar) {
      console.log('✅ Avatar loaded successfully, length:', profileData.avatar.length);
    }

    setFormData({
      name: profileData.name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      address: profileData.address || '',
      google_id: profileData.google_id || '',
      avatar: profileData.avatar || '',
      accountType: profileData.accountType || '',
      createdAt: profileData.createdAt || '',
      updatedAt: profileData.updatedAt || ''
    });

    hasSetFormData.current = true;
  }

  // Cleanup blob URL khi component unmount
  // useEffect(() => {
  //   return () => {
  //     if (avatarBlobUrl) {
  //       URL.revokeObjectURL(avatarBlobUrl);
  //     }
  //   };
  // }, [avatarBlobUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        toast.error('Lỗi định dạng', 'Vui lòng chọn file hình ảnh (JPG, PNG, GIF)!');
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Lỗi kích thước', 'Kích thước file không được vượt quá 5MB!');
        return;
      }

      setAvatarFile(file);

      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
        toast.success('Thành công', 'Đã chọn ảnh đại diện mới!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    toast.info('Đã xóa', 'Đã xóa ảnh đại diện mới');
  };

  // Validate avatar URL
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;

    // Kiểm tra base64 image
    if (url.startsWith('data:image')) {
      // Kiểm tra format base64 hợp lệ
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
      return base64Pattern.test(url);
    }

    // Kiểm tra extension cho URL thường
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = imageExtensions.some(ext =>
      url.toLowerCase().includes(ext)
    );

    // Kiểm tra URL format
    const isValidUrl = url.startsWith('http') || url.startsWith('/');

    return hasValidExtension || isValidUrl;
  };

  // Convert base64 to blob URL để tránh vấn đề với base64 quá dài
  // const convertBase64ToBlobUrl = (base64: string): string => {
  //   try {
  //     // Tách phần header và data
  //     const [header, data] = base64.split(',');
  //     const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

  //     // Convert base64 to binary
  //     const binaryString = atob(data);
  //     const bytes = new Uint8Array(binaryString.length);
  //     for (let i = 0; i < binaryString.length; i++) {
  //       bytes[i] = binaryString.charCodeAt(i);
  //     }

  //     // Tạo blob và blob URL
  //     const blob = new Blob([bytes], { type: mimeType });
  //     const blobUrl = URL.createObjectURL(blob);

  //     console.log('Converted base64 to blob URL:', blobUrl);
  //     return blobUrl;
  //   } catch (error) {
  //     console.error('Error converting base64 to blob:', error);
  //     return base64; // Fallback về base64 gốc
  //   }
  // };

  const handleSave = async () => {
    try {
      // Import API functions dựa trên accountType
      const { updateCustomerProfile, updateUserProfile } = await import('../services/api');

      // Chỉ gửi các trường có thể cập nhật
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        address: formData.address
      };

      // Chỉ thêm phone nếu accountType không phải "user"
      if (formData.accountType !== 'user') {
        updateData.phone = formData.phone;
      }

      // Nếu có file avatar mới, upload trước
      if (avatarFile) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('avatar', avatarFile);

          // TODO: Thay thế bằng API upload avatar thực tế
          // const uploadResponse = await uploadAvatar(formDataUpload);
          // updateData.avatar = uploadResponse.data.url;

          console.log('Avatar file ready for upload:', avatarFile.name);
          // Tạm thời sử dụng preview URL (trong thực tế cần upload lên server)
          updateData.avatar = avatarPreview;
        } catch (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          toast.error('Lỗi upload', 'Có lỗi xảy ra khi upload avatar!');
          return;
        }
      }

      console.log('Saving user data:', updateData);
      console.log('Account type:', formData.accountType);

      // Chọn API phù hợp dựa trên accountType
      let response;
      if (formData.accountType === 'customer') {
        console.log('Using customer API endpoint');
        response = await updateCustomerProfile(updateData);
      } else {
        // Cho user và các loại khác
        console.log('Using user API endpoint');
        response = await updateUserProfile(updateData);
      }

      if (response.data.statusCode === 200) {
        // Reset avatar states
        setAvatarFile(null);
        setAvatarPreview('');

        // Refresh profile data
        await refreshProfile();

        setIsEditing(false);

        // Show success message với thông tin API được sử dụng
        const apiType = formData.accountType === 'customer' ? 'Customer' : 'User';
        toast.success('Thành công', `Cập nhật thông tin ${apiType} thành công!`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Lỗi cập nhật', 'Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const getAvatarUrl = () => {
    try {
      // Đơn giản hóa function để tránh vòng lặp

      // Ưu tiên preview nếu đang chỉnh sửa và có file mới
      if (avatarPreview && avatarPreview.trim() !== '') {
        console.log('Using avatar preview');
        return avatarPreview;
      }

      // Kiểm tra avatar từ API
      if (formData.avatar && formData.avatar.trim() !== '') {
        const avatarLength = formData.avatar.length;
        console.log('Avatar length:', avatarLength, 'characters');

        // Kiểm tra xem có phải là URL hợp lệ không
        if (isValidImageUrl(formData.avatar)) {
          // Kiểm tra nếu là base64
          if (formData.avatar.startsWith('data:image')) {
            // Backend đã fix, avatar sẽ hoạt động bình thường
            return formData.avatar;
          } else {
            // URL avatar
            return formData.avatar;
          }
        } else {
          console.warn('Invalid avatar URL format');
        }
      }

      // Fallback về UI Avatars
      const userName = formData.name || 'User';
      const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=ffffff&size=200&bold=true&format=png`;
      console.log('🔄 Using fallback avatar for:', userName);
      return fallbackUrl;
    } catch (error) {
      console.error('Error in getAvatarUrl:', error);
      // Emergency fallback
      return `https://ui-avatars.com/api/?name=User&background=3b82f6&color=ffffff&size=200&bold=true&format=png`;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get user role display
  const getUserRoleDisplay = () => {
    if (actualRole === 'admin') return 'Admin';
    if (actualRole === 'staff') return 'Staff';
    return 'Customer';
  };

  // Get role color
  const getRoleColor = () => {
    if (actualRole === 'admin') return 'text-red-600 bg-red-50 border-red-200';
    if (actualRole === 'staff') return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full translate-y-24 -translate-x-24 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar with enhanced styling */}
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-blue-100/50 relative">
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    <img
                      src={getAvatarUrl()}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onLoadStart={() => {
                        setAvatarLoading(true);
                        console.log('Avatar loading started:', getAvatarUrl());
                      }}
                      onError={(e) => {
                        setAvatarLoading(false);
                        console.error('=== AVATAR ERROR DEBUG ===');
                        const failedUrl = getAvatarUrl();
                        console.error('Failed URL length:', failedUrl.length);
                        console.error('Failed URL type:', failedUrl.startsWith('data:image') ? 'Base64' : 'URL');
                        console.error('Failed URL start:', failedUrl.substring(0, 100));
                        console.error('formData.avatar length:', formData.avatar?.length || 0);
                        console.error('Is valid base64?:', failedUrl.startsWith('data:image/webp;base64,'));

                        // Test if base64 is corrupted
                        if (failedUrl.startsWith('data:image')) {
                          try {
                            const [header, data] = failedUrl.split(',');
                            console.error('Base64 header:', header);
                            console.error('Base64 data length:', data?.length || 0);
                            console.error('Base64 data start:', data?.substring(0, 50) || 'No data');
                          } catch (err) {
                            console.error('Base64 parsing error:', err);
                          }
                        }
                        console.error('========================');

                        // Fallback to UI Avatars nếu ảnh không load được
                        const target = e.target as HTMLImageElement;
                        const userName = formData.name || 'User';
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=dc2626&color=ffffff&size=200&bold=true&format=png`;

                        // Hiển thị thông tin debug cho user
                        const urlType = failedUrl.startsWith('data:image') ? 'Base64 Image' : 'URL';
                        toast.error('Lỗi Avatar', `Không thể tải ${urlType}. Sử dụng ảnh mặc định.`);
                      }}
                      onLoad={() => {
                        setAvatarLoading(false);
                        console.log('Avatar loaded successfully:', getAvatarUrl());
                      }}
                    />
                  </div>

                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-sm"></div>

                  {/* Avatar upload overlay - chỉ hiển thị khi đang edit */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="text-white text-center">
                          <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs">Đổi ảnh</span>
                        </div>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Remove avatar button - chỉ hiển thị khi có preview */}
                  {isEditing && avatarPreview && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      title="Xóa ảnh"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                    {formData.name || 'Người dùng'}
                  </h1>
                  {formData.email && (
                    <p className="text-gray-600 text-lg mb-3 flex items-center gap-2 justify-center sm:justify-start">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      {formData.email}
                    </p>
                  )}
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-sm text-gray-500 font-medium">Vai trò:</span>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${getRoleColor()} shadow-sm`}>
                      {getUserRoleDisplay()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Edit button with enhanced styling */}
              <button
                onClick={() => {
                  if (isEditing) {
                    // Reset avatar states khi cancel từ header
                    setAvatarFile(null);
                    setAvatarPreview('');
                  }
                  setIsEditing(!isEditing);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                  isEditing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-2 border-blue-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hủy
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Chỉnh sửa
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                  </div>
                
                  {/* Avatar Issue Warning removed - backend fixed */}

                  {/* Avatar Upload Section - chỉ hiển thị khi đang edit */}
                  {isEditing && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                              src={getAvatarUrl()}
                              alt="Avatar Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Avatar preview failed to load:', getAvatarUrl());
                                const target = e.target as HTMLImageElement;
                                const userName = formData.name || 'User';
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=dc2626&color=ffffff&size=200&bold=true&format=png`;
                              }}
                            />
                          </div>
                          {avatarPreview && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ảnh đại diện</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Chọn ảnh JPG, PNG hoặc GIF. Kích thước tối đa 5MB.
                          </p>

                          <div className="flex gap-3">
                            <label htmlFor="avatar-upload-form" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium">
                              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Chọn ảnh
                            </label>
                            <input
                              id="avatar-upload-form"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />

                            {avatarPreview && (
                              <button
                                onClick={handleRemoveAvatar}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                              >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa ảnh
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Họ và tên */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                          <p className="text-gray-900 font-medium">{formData.name || 'Chưa cập nhật'}</p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Nhập email"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                          <p className="text-gray-900 font-medium">{formData.email || 'Chưa cập nhật'}</p>
                        </div>
                      )}
                    </div>

                    {/* Số điện thoại - chỉ hiển thị khi có dữ liệu hoặc đang edit, và accountType không phải "user" */}
                    {(formData.phone || isEditing) && formData.accountType !== 'user' && (
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Số điện thoại
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Nhập số điện thoại"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <p className="text-gray-900 font-medium">{formData.phone}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Google ID - chỉ hiển thị khi có dữ liệu */}
                    {formData.google_id && (
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Google ID
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                          <p className="text-gray-900 font-medium font-mono text-sm">{formData.google_id}</p>
                        </div>
                      </div>
                    )}

                    {/* Vai trò - luôn hiển thị */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Vai trò
                      </label>
                      <div className="py-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor()}`}>
                          {getUserRoleDisplay()}
                        </span>
                      </div>
                    </div>

                    {/* Ngày tạo tài khoản - chỉ hiển thị khi có dữ liệu */}
                    {formData.createdAt && (
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Ngày tạo tài khoản
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                          <p className="text-gray-900 font-medium">{formatDate(formData.createdAt)}</p>
                        </div>
                      </div>
                    )}

                    {/* Địa chỉ - chỉ hiển thị khi có dữ liệu hoặc đang edit */}
                    {(formData.address || isEditing) && (
                      <div className="md:col-span-2 group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Địa chỉ
                        </label>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Nhập địa chỉ của bạn"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                            <p className="text-gray-900 font-medium">{formData.address}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Lần cập nhật cuối - chỉ hiển thị khi có dữ liệu */}
                    {formData.updatedAt && (
                      <div className="md:col-span-2 group">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Lần cập nhật cuối
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                          <p className="text-gray-900 font-medium">{formatDate(formData.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Save buttons */}
                  {isEditing && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          // Reset avatar states khi cancel
                          setAvatarFile(null);
                          setAvatarPreview('');
                        }}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Lưu thay đổi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Account Stats - chỉ hiển thị khi accountType không phải "user" */}
              {formData.accountType !== 'user' && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -translate-y-12 translate-x-12 opacity-40"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Thống kê tài khoản</h3>
                    </div>

                    {statsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : statsError ? (
                      <div className="text-center py-8">
                        <div className="text-red-500 mb-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">Không thể tải thống kê</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Thử lại
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tổng đơn hàng</span>
                          <span className="font-semibold text-blue-600">
                            {stats?.orders?.summary?.totalOrders || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Đã hoàn thành</span>
                          <span className="font-semibold text-green-600">
                            {stats?.orders?.ordersByStatus?.delivered || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Đang chờ xử lý</span>
                          <span className="font-semibold text-yellow-600">
                            {stats?.orders?.ordersByStatus?.pending || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tổng chi tiêu</span>
                          <span className="font-semibold text-purple-600">
                            {stats?.orders?.summary?.totalSpent
                              ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(stats.orders.summary.totalSpent)
                              : '0 ₫'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Thanh toán thành công</span>
                          <span className="font-semibold text-green-600">
                            {stats?.payments?.paid?.count || 0} đơn
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chờ thanh toán</span>
                          <span className="font-semibold text-orange-600">
                            {stats?.payments?.pending?.count || 0} đơn
                          </span>
                        </div>
                        {/* <div className="flex justify-between items-center">
                          <span className="text-gray-600">Điểm tích lũy</span>
                          <span className="font-semibold text-indigo-600">
                            {customerStats?.data?.result?.data?.loyaltyPoints || 0} điểm
                          </span>
                        </div> */}
                      </div>
                    )}

                    {stats && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-blue-800">Thông tin chi tiết</span>
                        </div>
                        <div className="text-xs text-blue-700 space-y-1">
                          <p>• Tháng này: {stats.orders?.monthlyStats?.[0]?.order_count || 0} đơn hàng</p>
                          <p>• Đơn hàng gần nhất: {stats.orders?.recentOrders?.[0]?.order_date ? new Date(stats.orders.recentOrders[0].order_date).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
                          <p>• Số tiền chờ thanh toán: {stats.payments?.pending?.amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.payments.pending.amount) : '0 ₫'}</p>
                          <p>• Customer ID: {stats.customerId}</p>
                          <p>• Cập nhật lúc: {new Date().toLocaleString('vi-VN')}</p>
                        </div>
                      </div>
                    )}

                    {/* Recent Orders Preview */}
                    {stats?.orders?.recentOrders && stats.orders.recentOrders.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <span className="text-sm font-medium text-green-800">Đơn hàng gần nhất</span>
                        </div>
                        <div className="space-y-2">
                          {stats.orders.recentOrders.slice(0, 3).map((order: any) => (
                            <div key={order.id} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  order.status === 'delivered' ? 'bg-green-500' :
                                  order.status === 'pending' ? 'bg-yellow-500' :
                                  order.status === 'processing' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}></span>
                                <span className="text-gray-600">
                                  {new Date(order.order_date).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-800">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                </div>
                                <div className={`text-xs ${
                                  order.status === 'delivered' ? 'text-green-600' :
                                  order.status === 'pending' ? 'text-yellow-600' :
                                  order.status === 'processing' ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {order.status === 'delivered' ? 'Đã giao' :
                                   order.status === 'pending' ? 'Chờ xử lý' :
                                   order.status === 'processing' ? 'Đang xử lý' : order.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-green-200">
                          <a href="/orders" className="text-xs text-green-700 hover:text-green-900 font-medium">
                            Xem tất cả đơn hàng →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-40"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.accountType === 'user' ? 'Quản trị viên' : 'Thao tác nhanh'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Chỉ hiển thị "Xem đơn hàng" cho customer, không hiển thị cho user (admin) */}
                    {formData.accountType !== 'user' && (
                      <a
                        href="/orders"
                        className="group flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-blue-200"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="font-medium">Xem đơn hàng</span>
                      </a>
                    )}

                    {/* Thao tác dành riêng cho admin user */}
                    {formData.accountType === 'user' && (
                      <>
                        <a
                          href="/admin"
                          className="group flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <span className="font-medium">Bảng điều khiển Admin</span>
                        </a>

                        <a
                          href="/admin/statistics"
                          className="group flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-indigo-200"
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <span className="font-medium">Thống kê</span>
                        </a>

                        <a
                          href="/admin/orders"
                          className="group flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-orange-200"
                        >
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <span className="font-medium">Quản lý đơn hàng</span>
                        </a>
                      </>
                    )}

                    {/* Chỉ hiển thị "Đổi mật khẩu" cho tài khoản không phải Google */}
                    {!formData.google_id && (
                      <a
                        href={(() => {
                          // Admin redirect đến /admin/change-password
                          if (formData.accountType === 'user') {
                            return '/admin/change-password';
                          }
                          // Customer redirect đến /change-password
                          return '/change-password';
                        })()}
                        className="group flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-green-200"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="font-medium">Đổi mật khẩu</span>
                      </a>
                    )}

                    <a
                      href="/support"
                      className="group flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <span className="font-medium">Hỗ trợ</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
