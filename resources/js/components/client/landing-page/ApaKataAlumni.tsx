import React from 'react';

const alumniList = [
  {name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
  {name: 'Arlene', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
  {name: 'Ronald', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
  {name: 'Philip', avatar: 'https://randomuser.me/api/portraits/men/54.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
  {name: 'Victoria', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
  {name: 'Shawn', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
];

export default function ApaKataAlumni() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Apa Kata Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-12">
          {alumniList.map((item) => (
            <div key={item.name} className="border-2 border-purple-400 rounded-2xl bg-white shadow flex flex-col p-6 min-h-[180px]">
              <div className="flex items-center gap-3 mb-2">
                <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="font-semibold text-base">{item.name}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{item.text}</p>
              <div className="flex justify-end text-gray-400">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 17h2a2 2 0 002-2v-6a2 2 0 00-2-2H7v10zm8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}