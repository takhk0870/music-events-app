import React, { useContext } from 'react';
import { UserContext } from './App';

const scaleDescriptions = {
  '超小規模': '（~30人）',
  '小規模': '（~100人）',
  '中規模': '（100人~500人）',
  '大規模': '（500人~）',
};

function Star({ filled, onClick }) {
  return (
    <button
      onClick={onClick}
      className="focus:outline-none ml-1"
      aria-label={filled ? 'お気に入り解除' : 'お気に入り追加'}
      title={filled ? 'お気に入り解除' : 'お気に入り追加'}
      style={{ fontSize: 18, color: filled ? '#fbbf24' : '#d1d5db', transition: 'color 0.2s' }}
    >
      {filled ? '★' : '☆'}
    </button>
  );
}

const EventDetail = ({
  name,
  datetime,
  location,
  artists,
  price,
  scale,
  links,
  genre
}) => {
  const { artistFavorites = [], toggleArtistFavorite } = useContext(UserContext) || {};
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8 mb-8 space-y-6 border border-gray-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-2">{name}</h1>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">ジャンル</h2>
        <div className="text-gray-700 text-base pl-4">{genre}</div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">日付と時間</h2>
        <div className="text-gray-700 text-base pl-4">{datetime}</div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">開催場所</h2>
        <div className="text-gray-700 text-base pl-4">{location}</div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">出演アーティスト</h2>
        <ul className="pl-4 list-disc text-gray-700">
          {artists.map((artist, idx) => (
            <li key={idx} className="flex items-center">
              {artist}
              <Star
                filled={artistFavorites && artistFavorites.includes(artist)}
                onClick={() => toggleArtistFavorite && toggleArtistFavorite(artist)}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">チケット代</h2>
        <div className="text-gray-700 text-base pl-4">{price}</div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">規模</h2>
        <div className="text-gray-700 text-base pl-4">{scale} {scaleDescriptions[scale] || ''}</div>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-pink-500 border-l-4 border-pink-300 pl-2 bg-pink-50 rounded">関連リンク</h2>
        <ul className="pl-4 list-disc text-blue-600">
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition-colors duration-150">{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default EventDetail; 