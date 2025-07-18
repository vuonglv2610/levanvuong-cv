import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  data: any;
  filename?: string;
  title?: string;
  dashboardRef?: React.RefObject<HTMLDivElement>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename = 'dashboard-report', 
  title = 'Báo cáo thống kê',
  dashboardRef
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'summary' | 'detailed'>('summary');

  // Xuất ra Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const ws = XLSX.utils.json_to_sheet(prepareDataForExport());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}.xlsx`);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Xuất ra PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Header với gradient background
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Logo và tên công ty
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("HUNG VUONG STORE", 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Bao cao thong ke kinh doanh", 105, 30, { align: 'center' });
      
      // Thông tin báo cáo
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("BAO CAO THONG KE DOANH THU", 105, 55, { align: 'center' });
      
      const today = new Date();
      const dateStr = today.toLocaleDateString('vi-VN');
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Ngay xuat: ${dateStr}`, 105, 65, { align: 'center' });
      
      // Thêm bảng với styling đẹp hơn
      const tableData = prepareDataForExport();
      const headers = Object.keys(tableData[0]);
      
      autoTable(doc, {
        head: [headers],
        body: tableData.map(row => headers.map(key => row[key as keyof typeof row])),
        startY: 80,
        theme: 'striped',
        styles: { 
          fontSize: 11, 
          cellPadding: 5,
          font: 'helvetica',
          halign: 'center'
        },
        headStyles: { 
          fillColor: [59, 130, 246], 
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 12
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'bold' },
          1: { halign: 'right' },
          2: { halign: 'center' }
        }
      });
      
      // Footer với thông tin liên hệ
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFillColor(245, 245, 245);
      doc.rect(0, finalY, 210, 30, 'F');
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text("Dia chi: 123 Duong ABC, Quan XYZ, TP.HCM", 105, finalY + 10, { align: 'center' });
      doc.text("Dien thoai: 0123.456.789 | Email: contact@hungvuongstore.com", 105, finalY + 18, { align: 'center' });
      
      // Page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Trang ${i} / ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`${filename}.pdf`);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Chuẩn bị dữ liệu cho xuất báo cáo
  const prepareDataForExport = () => {
    const exportData = [
      {
        'Chi so': 'Tong doanh thu',
        'Gia tri': data.totalRevenue?.toLocaleString('vi-VN') + ' VND',
        'Tang truong': data.revenueGrowth?.toFixed(1) + '%'
      },
      {
        'Chi so': 'Tong don hang',
        'Gia tri': data.totalOrders?.toLocaleString('vi-VN'),
        'Tang truong': data.orderGrowth?.toFixed(1) + '%'
      },
      {
        'Chi so': 'Tong khach hang',
        'Gia tri': data.totalCustomers?.toLocaleString('vi-VN'),
        'Tang truong': data.customerGrowth?.toFixed(1) + '%'
      },
      {
        'Chi so': 'Tong san pham',
        'Gia tri': data.totalProducts?.toLocaleString('vi-VN'),
        'Tang truong': '0%'
      }
    ];
    
    return exportData;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Xuất báo cáo
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={exportToPDF}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Xuất PDF
            </button>
            <button
              onClick={exportToExcel}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Xuất Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;







