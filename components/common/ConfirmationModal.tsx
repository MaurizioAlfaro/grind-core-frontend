import React from 'react';
import { StyledButton } from './StyledButton';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-yellow-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-orbitron font-bold text-yellow-400 mb-4">{title}</h2>
          <p className="text-gray-300 mb-8">{message}</p>
          <div className="flex justify-center gap-4">
            <StyledButton onClick={onCancel} variant="secondary" className="flex-1">
              {cancelText}
            </StyledButton>
            <StyledButton onClick={onConfirm} variant="danger" className="flex-1">
              {confirmText}
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};
