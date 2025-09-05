import React from 'react';

interface Props {
  readonly formData: any;
  readonly onFormDataChange: (field: string, value: any) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export default function SkillMinatForm({ formData, onFormDataChange, onNext, onBack }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ceritakan kemampuan yang ingin ditingkatkan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ceritakan secara spesifik kemampuan apa yang ingin Anda tingkatkan selama PKL?
          </label>
          <textarea
            value={formData.kemampuanDitingkatkan}
            onChange={(e) => onFormDataChange('kemampuanDitingkatkan', e.target.value)}
            placeholder="Kemampuan dari anda"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Ceritakan skill & kelebihan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ceritakan secara spesifik skill & kelebihan diri Anda yang bisa dikontribusikan ke perusahaan selama kegiatan PKL?
          </label>
          <textarea
            value={formData.skillKelebihan}
            onChange={(e) => onFormDataChange('skillKelebihan', e.target.value)}
            placeholder="Kemampuan kemampuan anda"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Bidang yang anda sukai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bidang yang anda sukai
          </label>
          <input
            type="text"
            value={formData.bidangYangDisukai}
            onChange={(e) => onFormDataChange('bidangYangDisukai', e.target.value)}
            placeholder="UI/UX Design"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Pernah membuat video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apakah Anda pernah membuat video review produk, review suatu tempat atau membuat mini vlog?
          </label>
          <select
            value={formData.pernahMembuatVideo}
            onChange={(e) => onFormDataChange('pernahMembuatVideo', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Pernah</option>
            <option value="pernah">Pernah</option>
            <option value="belum_pernah">Belum Pernah</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Lanjut
          </button>
        </div>
      </form>
    </div>
  );
}
