import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusNotificationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly status: 'success' | 'error' | 'info';
  readonly title: string;
  readonly message: string;
  readonly onConfirm?: () => void;
  readonly confirmText?: string;
}

export function StatusNotificationModal({ 
  isOpen, 
  onClose, 
  status, 
  title, 
  message, 
  onConfirm,
  confirmText = 'OK'
}: StatusNotificationModalProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'info':
        return <AlertCircle className="h-8 w-8 text-blue-600" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-3 ${getStatusColor()}`}>
            {getIcon()}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} className="w-full">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
