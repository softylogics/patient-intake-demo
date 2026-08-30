import React from 'react';
import { Question } from '../context/DemoDataContext';

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required={question.required}
          >
            <option value="">Select...</option>
            {question.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3" role="radiogroup" aria-label={question.label}>
            {question.options?.map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  required={question.required}
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 - Mild</span>
              <span>10 - Severe</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={value || 5}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              required={question.required}
            />
            <div className="flex justify-center">
              <span className="text-lg font-semibold text-gray-900">{value || 5}/10</span>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={question.required}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {question.label} {question.required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};