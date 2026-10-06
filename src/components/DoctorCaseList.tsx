import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PatientCase } from '../context/DemoDataContext';

interface DoctorCaseListProps {
  cases: PatientCase[];
  onSelectCase: (case_: PatientCase) => void;
}

export const DoctorCaseList: React.FC<DoctorCaseListProps> = ({ cases, onSelectCase }) => {
  const { t } = useLanguage();

  return (
    <div className="divide-y divide-gray-200">
      {cases.map(case_ => (
        <button
          key={case_.id}
          onClick={() => onSelectCase(case_)}
          className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{case_.name}</p>
              <p className="text-sm text-gray-500">{case_.complaint}</p>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{case_.severity}/10</p>
                <p className="text-xs text-gray-500">{case_.duration}</p>
              </div>
               <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    case_.redFlags && case_.redFlags.length > 0 && !case_.redFlags.includes('red_flag_none')
                      ? 'bg-red-100 text-red-700'
                      : case_.status === 'New'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {case_.redFlags && case_.redFlags.length > 0 && !case_.redFlags.includes('red_flag_none')
                    ? t('triaged')
                    : t(case_.status.toLowerCase())}
                </span>
            </div>
          </div>
        </button>
      ))}
      {cases.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-500">
          No patient cases yet.
        </div>
      )}
    </div>
  );
};