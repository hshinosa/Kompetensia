import React from 'react';

const reviews = [
  { id: 1, name: 'Jane Doe', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 2, name: 'Arlene', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 3, name: 'Ronald', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
];

export default function ReviewList() {
  return (
    <div id="review">
      <h4 className="text-lg font-semibold mb-4">Review Sertifikasi</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="border-2 border-purple-300 rounded-lg p-4">
            <div className="font-semibold mb-2">{r.name}</div>
            <div className="text-sm text-gray-700">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
