import React from 'react';
import TableManage from '../../components/TableManage';

const ArticleManagement = () => {
  return (
    <TableManage 
      url="/articles" 
      isShowFooter={true}
      title="Quản lý bài viết"
      addButtonText="Thêm bài viết mới"
      addPath="/admin/articles/add"
      editPath="/admin/articles/edit"
      columns={[
        { 
          key: "title", 
          header: "Tiêu đề", 
          render: (item: any) => (
            <div className="max-w-xs">
              <h3 className="font-medium text-gray-900 truncate">{item?.title || "Không có tiêu đề"}</h3>
              <p className="text-sm text-gray-500 truncate">{item?.excerpt || "Không có mô tả"}</p>
            </div>
          )
        },
        { 
          key: "featuredImage", 
          header: "Ảnh đại diện", 
          render: (item: any) => (
            item?.featuredImage ? (
              <img 
                src={item.featuredImage} 
                alt={item.title} 
                className="h-16 w-24 object-cover rounded-lg"
              />
            ) : (
              <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">Không có ảnh</span>
              </div>
            )
          )
        },
        { 
          key: "author", 
          header: "Tác giả", 
          render: (item: any) => (
            <div className="flex items-center">
              <div className="h-8 w-8 flex-shrink-0">
                <img 
                  className="h-8 w-8 rounded-full object-cover" 
                  src={item?.author?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                  alt={item?.author?.name || "Author"} 
                />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{item?.author?.name || "Không rõ"}</div>
              </div>
            </div>
          )
        },
        { 
          key: "category", 
          header: "Danh mục", 
          render: (item: any) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item?.category?.name || "Chưa phân loại"}
            </span>
          )
        },
        { 
          key: "status", 
          header: "Trạng thái", 
          render: (item: any) => {
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'published': return 'bg-green-100 text-green-800';
                case 'draft': return 'bg-yellow-100 text-yellow-800';
                case 'archived': return 'bg-gray-100 text-gray-800';
                default: return 'bg-gray-100 text-gray-800';
              }
            };
            
            const getStatusText = (status: string) => {
              switch (status) {
                case 'published': return 'Đã xuất bản';
                case 'draft': return 'Bản nháp';
                case 'archived': return 'Đã lưu trữ';
                default: return status;
              }
            };
            
            return (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                {getStatusText(item?.status)}
              </span>
            );
          }
        },
        { 
          key: "publishedAt", 
          header: "Ngày xuất bản", 
          render: (item: any) => (
            <div className="text-sm text-gray-900">
              {item?.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Chưa xuất bản'}
            </div>
          )
        },
        { 
          key: "views", 
          header: "Lượt xem", 
          render: (item: any) => (
            <div className="text-sm text-gray-900">
              {item?.views?.toLocaleString() || 0}
            </div>
          )
        }
      ]}
      filterOptions={{
        showCategoryFilter: true,
        customFilters: [
          {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
            options: [
              { value: 'ALL', label: 'Tất cả' },
              { value: 'published', label: 'Đã xuất bản' },
              { value: 'draft', label: 'Bản nháp' },
              { value: 'archived', label: 'Đã lưu trữ' }
            ]
          }
        ]
      }}
    />
  );
};

export default ArticleManagement;
