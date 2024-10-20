import React, { useMemo, useState } from 'react';
import { School, LicenseClass, DifferenceClass, LICENSE_FEES, CLASS_NAMES } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DetailedReportProps {
  schools: School[];
}

const DetailedReport: React.FC<DetailedReportProps> = ({ schools }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const calculateTotalFee = (candidates: School['candidates']) => {
    return Object.entries(candidates).reduce((total, [classType, count]) => {
      return total + count * LICENSE_FEES[classType as LicenseClass | DifferenceClass];
    }, 0);
  };

  const totalCandidates = useMemo(() => schools.reduce((sum, school) => 
    sum + Object.values(school.candidates).reduce((schoolSum, count) => schoolSum + count, 0), 0
  ), [schools]);

  const totalFee = useMemo(() => schools.reduce((sum, school) => sum + calculateTotalFee(school.candidates), 0), [schools]);

  const classTypes: (LicenseClass | DifferenceClass)[] = ['B', 'A1', 'A2', 'C', 'D', 'FARK_A1', 'FARK_A2', 'BAKANLIK_A1'];

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-indigo-600 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-white">Detaylı Sürücü Kursları Raporu</h3>
          <button
            onClick={toggleExpand}
            className="text-white focus:outline-none"
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
        {isExpanded && (
          <div className="bg-white overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurs Adı</th>
                  {classTypes.map((classType) => (
                    <th key={classType} scope="col" className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                      {CLASS_NAMES[classType]}
                    </th>
                  ))}
                  <th scope="col" className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">Toplam Kursiyer</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">Toplam Ücret</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schools.map((s) => {
                  const schoolTotalCandidates = Object.values(s.candidates).reduce((sum, count) => sum + count, 0);
                  const schoolTotalFee = calculateTotalFee(s.candidates);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{s.name}</td>
                      {classTypes.map((classType) => (
                        <td key={classType} className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                          {s.candidates[classType] || 0}
                        </td>
                      ))}
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center font-semibold">{schoolTotalCandidates}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center font-semibold">{schoolTotalFee.toLocaleString('tr-TR')} TL</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Toplam</td>
                  {classTypes.map((classType) => (
                    <td key={classType} className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-indigo-600 text-center">
                      {schools.reduce((sum, school) => sum + (school.candidates[classType] || 0), 0)}
                    </td>
                  ))}
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-indigo-600 text-center">{totalCandidates}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-indigo-600 text-center">{totalFee.toLocaleString('tr-TR')} TL</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedReport;