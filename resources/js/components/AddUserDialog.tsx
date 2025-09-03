import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddUserDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function AddUserDialog({ isOpen, onClose }: AddUserDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!formData.email.includes('@')) newErrors.email = 'Email tidak valid';
    if (!formData.password.trim()) newErrors.password = 'Password wajib diisi';
    if (formData.password.length < 8) newErrors.password = 'Password minimal 8 karakter';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Data yang akan dikirim ke backend dengan role admin dan field lain tidak dikirim
    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      role: 'admin',
      user_type: 'admin',
    };

    router.post(route('admin.users.store'), submitData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          password_confirmation: ''
        });
        setErrors({});
        onClose();
      },
      onError: (errors) => {
        setErrors(errors as FormErrors);
      },
      onFinish: () => {
        setIsLoading(false);
      }
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      // Reset form saat tutup
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Admin Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama admin"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Masukkan email"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Minimal 8 karakter"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          
          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Konfirmasi Password *</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
              placeholder="Ulangi password"
              className={errors.password_confirmation ? 'border-red-500' : ''}
            />
            {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Tambah Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
