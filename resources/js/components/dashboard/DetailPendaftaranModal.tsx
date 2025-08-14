import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BiodataPeserta { nama:string; tempatTanggalLahir:string; alamat:string; email:string; noTelepon:string }
export interface SertifikasiKompetensi { namaSertifikasi:string; jadwalSertifikasi:string; batch:string; assessor:string }
export interface PendaftarData { 
  user_id?: number;
  nama: string; 
  status: 'Pengajuan'|'Disetujui'|'Ditolak'; 
  biodata: BiodataPeserta; 
  sertifikasi: SertifikasiKompetensi;
  catatan_admin?: string;
}
interface Props { readonly isOpen:boolean; readonly pendaftarData:PendaftarData; readonly onClose:()=>void; readonly onApproval:(status:'Disetujui'|'Ditolak', alasan?:string)=>Promise<void> | void }

export function DetailPendaftaranModal({ isOpen, pendaftarData, onClose, onApproval }:Props) {
  const [rejectionReason,setRejectionReason] = React.useState('');
  const [showReject,setShowReject] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const approve = async () => { 
    setIsProcessing(true);
    try {
      await onApproval('Disetujui'); 
      onClose(); 
    } finally {
      setIsProcessing(false);
    }
  };
  const rejectFlow = () => setShowReject(true);
  const submitReject = async () => {
    if(!rejectionReason.trim()) return;
    setIsProcessing(true);
    try {
      await onApproval('Ditolak', rejectionReason);
      setRejectionReason('');
      setShowReject(false);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };
  const handleOpenChange = (open:boolean) => { if(!open){ setShowReject(false); setRejectionReason(''); onClose(); } };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-auto h-auto !max-w-[95vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detail Pendaftaran - {pendaftarData.nama}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="space-y-6">
              <Card className="min-w-[420px]">
                <CardHeader><CardTitle>Biodata Diri</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {['nama','tempatTanggalLahir','alamat','email','noTelepon'].map(key => {
                    let label = '';
                    switch(key){
                      case 'nama': label='Nama Peserta'; break;
                      case 'tempatTanggalLahir': label='Tempat/Tanggal Lahir'; break;
                      case 'alamat': label='Alamat'; break;
                      case 'email': label='Email'; break;
                      case 'noTelepon': label='No. Telepon'; break;
                    }
                    return (
                      <div key={key}>
                        <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
                        <p className="text-sm font-medium">{(pendaftarData.biodata as any)[key]}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Card className="min-w-[420px]">
                <CardHeader><CardTitle>Sertifikasi Kompetensi</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {['namaSertifikasi','jadwalSertifikasi','batch','assessor'].map(key => {
                    let label='';
                    switch(key){
                      case 'namaSertifikasi': label='Nama Sertifikasi'; break;
                      case 'jadwalSertifikasi': label='Jadwal Sertifikasi'; break;
                      case 'batch': label='Batch'; break;
                      case 'assessor': label='Assessor'; break;
                    }
                    return (
                      <div key={key}>
                        <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
                        <p className="text-sm font-medium">{(pendaftarData.sertifikasi as any)[key]}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex-shrink-0 space-y-4">
            {pendaftarData.status==='Pengajuan' && !showReject && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base">Approval</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button onClick={approve} className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                      {isProcessing ? 'Memproses...' : 'Setujui'}
                    </Button>
                    <Button onClick={rejectFlow} variant="destructive" className="w-full" disabled={isProcessing}>
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {showReject && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base">Alasan Penolakan</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <textarea 
                      value={rejectionReason} 
                      onChange={e=>setRejectionReason(e.target.value)} 
                      placeholder="Masukkan alasan penolakan..." 
                      className="w-full min-h-[100px] max-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                    <div className="flex gap-2">
                      <Button onClick={submitReject} variant="destructive" className="flex-1" disabled={!rejectionReason.trim() || isProcessing}>
                        {isProcessing ? 'Memproses...' : 'Kirim'}
                      </Button>
                      <Button onClick={()=>setShowReject(false)} variant="outline" className="flex-1" disabled={isProcessing}>
                        Batal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {pendaftarData.status === 'Ditolak' && pendaftarData.catatan_admin && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base text-red-600">Alasan Penolakan</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 bg-red-50 p-3 rounded-md border border-red-200 max-h-32 overflow-y-auto">
                    {pendaftarData.catatan_admin}
                  </div>
                </CardContent>
              </Card>
            )}
            {pendaftarData.status === 'Disetujui' && (
              <Card className="min-w-[300px] max-w-[350px]">
                <CardHeader><CardTitle className="text-base text-green-600">Status Pendaftaran</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Pendaftaran Disetujui</span>
                  </div>
                  {pendaftarData.catatan_admin && (
                    <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-md border border-green-200 mt-3 max-h-32 overflow-y-auto">
                      {pendaftarData.catatan_admin}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
