import { useQueryClient } from '@tanstack/react-query';
import useToast from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'file' | 'image'| 'password';
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
  validation?: {
    required?: string;
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    minLength?: { value: number; message: string };
    validate?: (value: any, formValues: any) => string | boolean;
  };
}

interface FormProps {
  title: string;
  fields: FormField[];
  initialValues?: any;
  onSubmit: (data: any) => Promise<any>;
  backUrl: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  invalidateQueryKey?: string;
  redirectAfterSubmit?: string;
  transformBeforeSubmit?: (data: any) => any;
}

const FormComponent: React.FC<FormProps> = ({
  title,
  fields,
  initialValues = {},
  onSubmit,
  backUrl,
  submitButtonText = 'Lưu',
  cancelButtonText = 'Hủy',
  invalidateQueryKey,
  redirectAfterSubmit,
  transformBeforeSubmit
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: initialValues
  });

  // Set initial values when they change (for edit forms)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(initialValues);
      
      // Set image preview if available
      if (initialValues.img) {
        setImagePreview(initialValues.img);
      } else if (initialValues.avatar) {
        setImagePreview(initialValues.avatar);
      } else if (initialValues.logo) {
        setImagePreview(initialValues.logo);
      }
    }
  }, [initialValues, reset]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
      setImagePreview(base64);
      setValue('img', base64);
      setValue('logo', base64); // Also set logo field for brands
      setValue('avatar', base64); // Also set avatar field for users
      console.log('Image uploaded and set:', base64.substring(0, 50) + '...');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      console.log('Raw form data:', data);
      console.log('Image preview:', imagePreview);

      // Transform data before submitting if needed
      const submissionData = transformBeforeSubmit ? transformBeforeSubmit(data) : data;

      // Handle image/logo/avatar fields
      if (imagePreview) {
        submissionData.img = imagePreview;
        submissionData.logo = imagePreview;
        submissionData.avatar = imagePreview;
      } else if (data.img) {
        submissionData.img = data.img;
      } else if (data.logo) {
        submissionData.logo = data.logo;
      } else if (data.avatar) {
        submissionData.avatar = data.avatar;
      }

      // Remove empty string values and replace with null
      Object.keys(submissionData).forEach(key => {
        if (submissionData[key] === '') {
          submissionData[key] = null;
        }
      });

      console.log('Final submission data:', submissionData);

      const response = await onSubmit(submissionData);
      
      if (response) {
        // Invalidate queries if needed
        if (invalidateQueryKey) {
          await queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
        }
        
        toast.success('Thành công', 'Thao tác đã được thực hiện thành công!');

        // Redirect after successful submission
        if (redirectAfterSubmit) {
          navigate(redirectAfterSubmit);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Lỗi', 'Có lỗi xảy ra khi thực hiện thao tác!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const { name, label, type, required, options, rows, placeholder, validation } = field;
    
    const registerOptions = {
      required: required ? validation?.required || `Vui lòng nhập ${label}` : false,
      ...validation,
      validate: validation?.validate ? (value: any) => validation.validate!(value, watch()) : undefined
    };

    switch (type) {
      case 'textarea':
        return (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={name}
              rows={rows || 4}
              {...register(name, registerOptions)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
              placeholder={placeholder}
            />
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message as string}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={name}
              {...register(name, registerOptions)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.7rem center',
                backgroundSize: '1em'
              }}
            >
              <option value="">-- Chọn {label} --</option>
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message as string}</p>}
          </div>
        );
        
      case 'image':
        return (
          <div key={name} className="w-full">
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {/* Hidden input for react-hook-form */}
            <input
              type="hidden"
              {...register(name, registerOptions)}
            />
            <input
              type="file"
              id={name}
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2.5"
            />
            {imagePreview && (
              <div className="mt-2 w-full">
                <div className="relative w-full h-32 overflow-hidden border rounded">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
                    }}
                  />
                </div>
              </div>
            )}
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message as string}</p>}
          </div>
        );
        
      case 'number':
        return (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              id={name}
              {...register(name, registerOptions)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
              placeholder={placeholder}
            />
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message as string}</p>}
          </div>
        );
        
      default: // text input
        return (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              id={name}
              {...register(name, registerOptions)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
              placeholder={placeholder}
            />
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message as string}</p>}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={() => navigate(backUrl)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => {
            // Textarea và image luôn chiếm toàn bộ chiều rộng
            if (field.type === 'textarea' || field.type === 'image') {
              return (
                <div key={field.name} className="md:col-span-2">
                  {renderField(field)}
                </div>
              );
            }
            return renderField(field);
          })}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(backUrl)}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
            }`}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Đang xử lý...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;


