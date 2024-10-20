import React, { useState, useMemo } from 'react';
import { School, LicenseClass, DifferenceClass, LICENSE_FEES, CLASS_NAMES } from '../types';
import Chat from './Chat';
import { LogOut, Car, PlusCircle, ChevronDown, ChevronUp, Users, Calculator, MessageSquare, BarChart2 } from 'lucide-react';
import DetailedReport from './DetailedReport';
import AnalyticsChart from './AnalyticsChart';

interface DashboardProps {
  school: School;
  onLogout: () => void;
  schools: School[];
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ school, onLogout, schools, updateCandidates }) => {
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleCandidateChange = (licenseClass: LicenseClass | DifferenceClass, change: number) => {
    const updatedCandidates = {
      ...school.candidates,
      [licenseClass]: Math.max(0, (school.candidates[licenseClass] || 0) + change)
    };
    updateCandidates(school.id, updatedCandidates);
  };

  const totalCandidates = useMemo(() => 
    Object.values(school.candidates).reduce((sum, count) => sum + count, 0),
    [school.candidates]
  );

  const totalFee = useMemo(() => 
    Object.entries(school.candidates).reduce((sum, [classType, count]) => 
      sum + count * LICENSE_FEES[classType as LicenseClass | DifferenceClass], 0
    ),
    [school.candidates]
  );

  const toggleCandidateForm = () => setShowCandidateForm(!showCandidateForm);
  const toggleAnalytics = () => setShowAnalytics(!showAnalytics);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">{school.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="h-5 w-5 mr-2 sm:mr-0" />
              <span className="hidden sm:inline">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-4">Hoş Geldiniz, {school.name}!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Bu yönetim panelinde kursiyer sayılarınızı güncelleyebilir, detaylı raporları görüntüleyebilir ve diğer sürücü kurslarıyla iletişim kurabilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Kursiyer Ekleme Bölümü</h3>
            <button
              onClick={toggleCandidateForm}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              {showCandidateForm ? 'Gizle' : 'Kursiyer Ekle'}
            </button>
          </div>
          {showCandidateForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(CLASS_NAMES).map(([classType, className]) => (
                <div key={classType} className="flex flex-col items-center p-4 border rounded-lg">
                  <span className="font-semibold mb-2 text-sm sm:text-base">{className}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, -1)}
                      className="px-2 py-1 bg-red-500 text-white rounded-l hover:bg-red-600 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100 text-sm sm:text-base">
                      {school.candidates[classType as LicenseClass | DifferenceClass] || 0}
                    </span>
                    <button
                      onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, 1)}
                      className="px-2 py-1 bg-green-500 text-white rounded-r hover:bg-green-600 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-base sm:text-lg font-semibold">Toplam Kursiyer: <span className="text-indigo-600">{totalCandidates}</span></p>
              <p className="text-base sm:text-lg font-semibold">Toplam Ücret: <span className="text-indigo-600">{totalFee.toLocaleString('tr-TR')} TL</span></p>
            </div>
            <button
              onClick={toggleAnalytics}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              {showAnalytics ? 'Analizi Gizle' : 'Analizi Göster'}
            </button>
          </div>
        </div>
      </div>

      {showAnalytics && <AnalyticsChart school={school} />}

      <DetailedReport schools={schools} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-4 sm:px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Sürücü Kursları İletişim Kanalı</h2>
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Bu bölümde diğer sürücü kurslarıyla iletişim kurabilir, bilgi paylaşımında bulunabilir ve işbirliği yapabilirsiniz.
            </p>
            <Chat currentSchool={school} schools={schools} />
          </div>
        </div>
      </div>

      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            © 2024 Sürücü Kursu Yönetim Sistemi. Tüm hakları saklıdır. Haşim Doğan Işık tarafından tasarlanmış ve kodlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;