import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: initialValues
  });

  // Set initial values when they change (for edit forms)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(initialValues);
      
      // Set image preview if available
      if (initialValues.img) {
        setImagePreview(initialValues.img);
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
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Transform data before submitting if needed
      const submissionData = transformBeforeSubmit ? transformBeforeSubmit(data) : data;
      
      // Add image if available
      if (imagePreview) {
        submissionData.img = imagePreview;
      }
      
      const response = await onSubmit(submissionData);
      
      if (response) {
        // Invalidate queries if needed
        if (invalidateQueryKey) {
          await queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
        }
        
        toast.success('Thao tác thành công!');
        
        // Redirect after successful submission
        if (redirectAfterSubmit) {
          navigate(redirectAfterSubmit);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const { name, label, type, required, options, rows, placeholder, validation } = field;
    
    const registerOptions = {
      required: required ? validation?.required || `Vui lòng nhập ${label}` : false,
      ...validation
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


