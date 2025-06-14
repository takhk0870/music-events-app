import React, { useState, useContext, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import EventDetail from './EventDetail'
import './App.css'

// ユーザーとお気に入り情報のContext
export const UserContext = createContext();

// 仮ユーザーデータ（本来はAPI管理）
const mockUsers = [
  {
    id: 1,
    name: 'テストユーザー',
    email: 'test@example.com',
    password: 'password',
    favorites: [1, 3],
  },
];

const genres = ['ロック', 'ポップ', 'ジャズ', 'クラシック', 'EDM'];
const regions = ['東京', '大阪', '名古屋', '福岡', '札幌'];

const events = [
  {
    id: 1,
    name: 'サマー・ロック・フェス',
    date: '2024-08-12',
    time: '18:00〜21:00',
    location: '東京ドーム',
    artists: ['The Rockers', 'Pop Queens', 'DJ Future'],
    price: '¥1000〜',
    scale: '大規模',
    links: [
      { label: '公式サイト', url: 'https://example.com' },
      { label: 'チケット購入', url: 'https://tickets.example.com' }
    ],
    genre: 'ロック',
    region: '東京',
  },
  {
    id: 2,
    name: '夜のジャズライブ',
    date: '2024-07-20',
    time: '19:00〜22:00',
    location: '大阪ホール',
    artists: ['Jazz Night'],
    price: '無料',
    scale: '小規模',
    links: [
      { label: 'イベント詳細', url: 'https://jazznight.example.com' }
    ],
    genre: 'ジャズ',
    region: '大阪',
  },
  {
    id: 3,
    name: 'クラシックの夕べ',
    date: '2024-09-01',
    time: '17:00〜19:00',
    location: '名古屋市民会館',
    artists: ['Classic Stars'],
    price: '¥2000',
    scale: '中規模',
    links: [
      { label: '公式ページ', url: 'https://classic.example.com' }
    ],
    genre: 'クラシック',
    region: '名古屋',
  },
  {
    id: 4,
    name: 'EDMパーティー',
    date: '2024-08-30',
    time: '20:00〜24:00',
    location: '福岡アリーナ',
    artists: ['DJ Future'],
    price: '¥1500',
    scale: '大規模',
    links: [
      { label: 'イベント詳細', url: 'https://edm.example.com' }
    ],
    genre: 'EDM',
    region: '福岡',
  },
  {
    id: 5,
    name: 'ポップスコンサート',
    date: '2024-10-10',
    time: '16:00〜18:00',
    location: '札幌コンサートホール',
    artists: ['Pop Queens'],
    price: '¥1200',
    scale: '超小規模',
    links: [
      { label: 'チケット', url: 'https://pop.example.com' }
    ],
    genre: 'ポップ',
    region: '札幌',
  },
];

/** ログイン/新規登録ページ */
function AuthPage() {
  const { login } = useContext(UserContext);
  const [tab, setTab] = useState('login');
  // ログイン用state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // 新規登録用state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const found = mockUsers.find(u => u.email === loginEmail && u.password === loginPassword);
    if (found) {
      login(found);
      navigate('/');
    } else {
      alert('メールアドレスまたはパスワードが違います');
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert('新規登録（ダミー）: ' + regEmail);
      setRegName(''); setRegEmail(''); setRegPassword('');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs mt-8">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 rounded-l-xl font-bold ${tab === 'login' ? 'bg-pink-200 text-pink-700' : 'bg-pink-50 text-gray-400'}`}
              onClick={() => setTab('login')}
            >ログイン</button>
            <button
              className={`flex-1 py-2 rounded-r-xl font-bold ${tab === 'register' ? 'bg-pink-200 text-pink-700' : 'bg-pink-50 text-gray-400'}`}
              onClick={() => setTab('register')}
            >新規登録</button>
          </div>
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">メールアドレス</label>
                <input type="email" className="w-full border rounded px-2 py-1" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">パスワード</label>
                <input type="password" className="w-full border rounded px-2 py-1" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded font-bold hover:bg-pink-400 transition">ログイン</button>
            </form>
          ) : (
            submitted ? (
              <div className="text-center text-pink-600 font-semibold py-8">登録が完了しました！</div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">名前</label>
                  <input type="text" className="w-full border rounded px-2 py-1" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">メールアドレス</label>
                  <input type="email" className="w-full border rounded px-2 py-1" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">パスワード</label>
                  <input type="password" className="w-full border rounded px-2 py-1" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded font-bold hover:bg-pink-400 transition">登録</button>
              </form>
            )
          )}
        </div>
        <Link className="mt-8 text-pink-600 hover:underline" to="/">← 戻る</Link>
      </div>
      <Footer />
    </div>
  );
}

/** ヘッダーコンポーネント */
function Header() {
  const { user, logout } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  const handlePostClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <header className="w-full bg-pink-100 py-4 shadow text-center flex items-center justify-between px-6">
      <Link to="/" className="text-2xl font-bold text-pink-700 tracking-wide">Music Events</Link>
      <div className="flex items-center gap-2">
        <Link
          to={user ? "/event-post" : "/auth"}
          className="bg-pink-200 text-pink-700 px-4 py-2 rounded font-semibold shadow hover:bg-pink-300 transition"
          onClick={handlePostClick}
        >
          イベント投稿
        </Link>
        {user ? (
          <span className="text-pink-700 font-semibold mr-2">{user.name} さん</span>
        ) : null}
        <Link
          to={user ? "/" : "/auth"}
          className="bg-pink-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-pink-400 transition"
          onClick={user ? logout : undefined}
        >
          {user ? 'ログアウト' : 'ログイン/新規登録'}
        </Link>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs relative">
            <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => setShowModal(false)}>&times;</button>
            <div className="text-lg font-bold text-pink-600 mb-4 text-center">イベント投稿にはユーザー登録が必要です</div>
            <Link
              to="/auth"
              className="block w-full bg-pink-500 text-white py-2 rounded font-bold text-center hover:bg-pink-400 transition"
              onClick={() => setShowModal(false)}
            >
              ユーザー登録/ログインページへ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/** フッターコンポーネント */
function Footer() {
  return (
    <footer className="w-full bg-pink-100 py-3 text-center mt-auto">
      <span className="text-pink-600 text-sm">&copy; 2024 Music Events. All rights reserved.</span>
    </footer>
  );
}

/** 星マークコンポーネント */
function Star({ filled, onClick }) {
  return (
    <button
      onClick={onClick}
      className="focus:outline-none"
      aria-label={filled ? 'お気に入り解除' : 'お気に入り追加'}
      title={filled ? 'お気に入り解除' : 'お気に入り追加'}
      style={{ fontSize: 24, color: filled ? '#fbbf24' : '#d1d5db', transition: 'color 0.2s' }}
    >
      {filled ? '★' : '☆'}
    </button>
  );
}

/** カレンダービューコンポーネント */
function CalendarView({ events }) {
  // 年月の状態
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  // 月切り替え
  const prevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekDay = firstDay.getDay();

  // 日付ごとにイベントをまとめる
  const eventsByDate = {};
  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDate[day]) eventsByDate[day] = [];
      eventsByDate[day].push(ev);
    }
  });

  // カレンダー配列作成
  const calendar = [];
  let week = [];
  for (let i = 0; i < startWeekDay; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-center mb-2 space-x-4">
        <button onClick={prevMonth} className="px-2 py-1 rounded bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold">←</button>
        <span className="text-lg font-bold text-pink-700">{year}年 {month + 1}月</span>
        <button onClick={nextMonth} className="px-2 py-1 rounded bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold">→</button>
      </div>
      <table className="min-w-[400px] w-full border-collapse">
        <thead>
          <tr className="bg-pink-100">
            {["日","月","火","水","木","金","土"].map((d, i) => (
              <th key={i} className="py-2 px-1 text-center text-pink-700 font-bold">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendar.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} className={`h-24 align-top border border-pink-100 p-1 ${j === 0 ? 'text-red-400' : ''} ${j === 6 ? 'text-blue-400' : ''}` + (day ? ' bg-white' : ' bg-pink-50') }>
                  {day && (
                    <div className="font-bold mb-1">{day}</div>
                  )}
                  {day && eventsByDate[day] && eventsByDate[day].map(ev => (
                    <Link
                      key={ev.id}
                      to={`/event/${ev.id}`}
                      className="block text-xs bg-pink-100 text-pink-700 rounded px-1 py-0.5 mb-1 hover:bg-pink-200 truncate"
                      title={ev.name}
                    >
                      {ev.name}
                    </Link>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** アーティスト横並びブロック一覧 */
function ArtistBlockList({ artistFavorites, toggleArtistFavorite }) {
  // 全イベントからアーティストとジャンルの対応を抽出
  const artistGenreMap = {};
  events.forEach(ev => {
    ev.artists.forEach(a => {
      if (!artistGenreMap[a]) artistGenreMap[a] = new Set();
      artistGenreMap[a].add(ev.genre);
    });
  });
  const allArtists = Object.keys(artistGenreMap);
  const allGenres = Array.from(new Set(events.map(ev => ev.genre)));

  const [selectedGenre, setSelectedGenre] = useState('');

  // ジャンルでフィルタ
  const filteredArtists = selectedGenre
    ? allArtists.filter(a => artistGenreMap[a].has(selectedGenre))
    : allArtists;

  // アーティストのWebページURL（仮: アーティスト名をエンコードしてexample.comに）
  function getArtistUrl(name) {
    return `https://example.com/artist/${encodeURIComponent(name)}`;
  }

  // アーティスト画像（イニシャルSVGダミー）
  function ArtistAvatar({ name }) {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    return (
      <svg width="48" height="48" className="mb-2 rounded-full bg-pink-100" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill="#fce7f3" />
        <text x="50%" y="54%" textAnchor="middle" fontSize="20" fill="#db2777" fontWeight="bold" dominantBaseline="middle">{initials}</text>
      </svg>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold text-pink-600 mr-4">アーティスト一覧</h2>
          <select
            className="border rounded px-2 py-1 text-base"
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
          >
            <option value="">すべてのジャンル</option>
            {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {filteredArtists.map(artist => (
              <div key={artist} className="bg-white rounded-xl shadow p-4 flex flex-col items-center min-w-[140px]">
                <ArtistAvatar name={artist} />
                <a
                  href={getArtistUrl(artist)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 font-bold text-lg mb-2 hover:underline hover:text-pink-500"
                >
                  {artist}
                </a>
                <div className="flex flex-wrap justify-center gap-1 mb-1">
                  {[...artistGenreMap[artist]].map(g => (
                    <span key={g} className="px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold border border-pink-200">{g}</span>
                  ))}
                </div>
                <Star
                  filled={artistFavorites && artistFavorites.includes(artist)}
                  onClick={() => toggleArtistFavorite && toggleArtistFavorite(artist)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** イベント一覧ページ */
function EventListPage({ allEvents }) {
  const { favorites, toggleFavorite, artistFavorites, toggleArtistFavorite, user } = useContext(UserContext);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const filteredEvents = allEvents.filter(e =>
    (selectedGenre === '' || e.genre === selectedGenre) &&
    (selectedRegion === '' || e.region === selectedRegion)
  );
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-1/5 bg-white p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-lg font-bold mb-4">検索フィルター</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">ジャンル</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
            >
              <option value="">すべて</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">地域</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
            >
              <option value="">すべて</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              className={`px-3 py-1 rounded-l bg-pink-200 font-bold ${view === 'list' ? 'text-pink-700' : 'text-gray-400'} border-r border-pink-300`}
              onClick={() => setView('list')}
            >リスト</button>
            <button
              className={`px-3 py-1 rounded-r bg-pink-200 font-bold ${view === 'calendar' ? 'text-pink-700' : 'text-gray-400'}`}
              onClick={() => setView('calendar')}
            >カレンダー</button>
          </div>
        </aside>

        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">イベント一覧</h1>
          {view === 'list' ? (
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-gray-500">該当するイベントがありません。</div>
              ) : (
                filteredEvents.map((event) => {
                  const isFavorite = favorites.includes(event.id);
                  return (
                    <div key={event.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link
                          className="text-lg font-semibold text-pink-600 hover:underline hover:text-pink-400 transition-colors"
                          to={`/event/${event.id}`}
                        >
                          {event.name}
                        </Link>
                        <Star filled={isFavorite} onClick={() => toggleFavorite(event.id)} />
                      </div>
                      <div className="text-gray-500 text-sm">{event.date} / {event.artists.join(', ')}</div>
                      <div className="mt-2 md:mt-0 flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{event.genre}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{event.region}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <CalendarView events={filteredEvents} />
          )}
        </main>

        <aside className="w-full md:w-1/5 p-4 flex-shrink-0">
          <div className="h-48 md:h-[500px] bg-gray-200 rounded flex items-center justify-center text-gray-600 text-lg font-bold">
            広告エリア
          </div>
        </aside>
      </div>
      <ArtistBlockList artistFavorites={artistFavorites} toggleArtistFavorite={toggleArtistFavorite} />
      <Footer />
    </div>
  );
}

/** イベント詳細ページ */
function EventDetailPage({ allEvents, onEdit, onDelete }) {
  const { id } = useParams();
  const { favorites, toggleFavorite } = useContext(UserContext);
  const event = allEvents.find(e => e.id === Number(id));
  const navigate = useNavigate();
  if (!event) return <Navigate to="/" />;
  const isFavorite = favorites.includes(event.id);
  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />
      <button
        className="mt-6 ml-6 w-fit text-pink-600 hover:underline"
        onClick={() => navigate('/')}
      >
        ← 戻る
      </button>
      <div className="flex items-center justify-center mb-2 mt-4">
        <Star filled={isFavorite} onClick={() => toggleFavorite(event.id)} />
        <span className="ml-2 text-pink-600 font-semibold">お気に入り</span>
      </div>
      <EventDetail
        name={event.name}
        datetime={`${event.date} ${event.time}`}
        location={event.location}
        artists={event.artists}
        price={event.price}
        scale={event.scale}
        links={event.links}
        genre={event.genre}
      />
      <div className="mt-6 flex space-x-2">
        <button
          className="text-pink-600 hover:underline"
          onClick={() => onEdit && onEdit(event)}
        >
          編集
        </button>
        <button
          className="text-pink-600 hover:underline"
          onClick={() => onDelete && onDelete(event.id)}
        >
          削除
        </button>
      </div>
      <Footer />
    </div>
  );
}

/** ユーザーContextプロバイダー */
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // イベントのお気に入り
  const [artistFavorites, setArtistFavorites] = useState([]); // アーティストのお気に入り
  const [userEvents, setUserEvents] = useState([]); // 投稿イベント
  const [editEvent, setEditEvent] = useState(null); // 編集中イベント

  // ログイン時にユーザー情報とお気に入りをセット
  const login = (userObj) => {
    setUser(userObj);
    setFavorites(userObj.favorites || []);
    setArtistFavorites(userObj.artistFavorites || []);
  };
  // ログアウト時にクリア
  const logout = () => {
    setUser(null);
    setFavorites([]);
    setArtistFavorites([]);
  };
  // イベントお気に入りトグル
  const toggleFavorite = (eventId) => {
    setFavorites(favs => {
      let newFavs;
      if (favs.includes(eventId)) {
        newFavs = favs.filter(id => id !== eventId);
      } else {
        newFavs = [...favs, eventId];
      }
      if (user) user.favorites = newFavs;
      return newFavs;
    });
  };
  // アーティストお気に入りトグル
  const toggleArtistFavorite = (artist) => {
    setArtistFavorites(favs => {
      let newFavs;
      if (favs.includes(artist)) {
        newFavs = favs.filter(a => a !== artist);
      } else {
        newFavs = [...favs, artist];
      }
      if (user) user.artistFavorites = newFavs;
      return newFavs;
    });
  };

  // 投稿・編集
  const handleEventSubmit = (eventData) => {
    if (eventData.id) {
      // 編集
      setUserEvents(prev => prev.map(ev => ev.id === eventData.id ? eventData : ev));
    } else {
      // 新規投稿
      const newEvent = { ...eventData, id: Date.now() };
      setUserEvents(prev => [...prev, newEvent]);
    }
    setEditEvent(null);
  };
  // 削除
  const handleEventDelete = (id) => {
    if (window.confirm('本当に削除しますか？')) {
      setUserEvents(prev => prev.filter(ev => ev.id !== id));
    }
  };

  // 投稿・既存イベントを合成
  const allEvents = [...events, ...userEvents];

  return (
    <UserContext.Provider value={{ user, login, logout, favorites, toggleFavorite, artistFavorites, toggleArtistFavorite }}>
      {children}
    </UserContext.Provider>
  );
}

function EventPostForm({ onSubmit, editData, onDelete }) {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState(editData || {
    name: '', datetime: '', location: '', genre: '', artists: '', price: '', scale: '', link: '',
  });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const genres = ['ロック', 'ポップ', 'ジャズ', 'クラシック', 'EDM'];
  const scales = ['超小規模', '小規模', '中規模', '大規模'];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const eventData = {
      ...form,
      artists: form.artists.split(',').map(a => a.trim()).filter(Boolean),
      links: form.link ? [{ label: '公式サイト', url: form.link }] : [],
      createdBy: user ? user.email : null,
      createdAt: form.createdAt || new Date().toISOString(),
      id: form.id || undefined,
    };
    setSubmitted(true);
    if (onSubmit) onSubmit(eventData);
    setTimeout(() => setSubmitted(false), 1500);
    setForm({ name: '', datetime: '', location: '', genre: '', artists: '', price: '', scale: '', link: '' });
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8 my-8 text-center">
        <div className="text-pink-600 font-bold text-lg mb-2">イベント投稿にはログインが必要です</div>
        <Link to="/auth" className="text-pink-500 underline hover:text-pink-400">ログイン/新規登録ページへ</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8 my-8">
      <h2 className="text-xl font-bold text-pink-600 mb-4">{editData ? 'イベント情報を編集' : 'イベント情報を投稿'}</h2>
      {submitted && <div className="text-center text-pink-600 font-semibold mb-4">{editData ? '編集しました！' : '投稿しました！（consoleに出力）'}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">イベント名</label>
          <input type="text" name="name" className="w-full border rounded px-2 py-1" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">日時</label>
          <input type="datetime-local" name="datetime" className="w-full border rounded px-2 py-1" value={form.datetime} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">場所</label>
          <input type="text" name="location" className="w-full border rounded px-2 py-1" value={form.location} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ジャンル</label>
          <select name="genre" className="w-full border rounded px-2 py-1" value={form.genre} onChange={handleChange} required>
            <option value="">選択してください</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">出演者（カンマ区切り）</label>
          <input type="text" name="artists" className="w-full border rounded px-2 py-1" value={form.artists} onChange={handleChange} required placeholder="例: The Rockers, Pop Queens" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">チケット代</label>
          <input type="text" name="price" className="w-full border rounded px-2 py-1" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">規模</label>
          <select name="scale" className="w-full border rounded px-2 py-1" value={form.scale} onChange={handleChange} required>
            <option value="">選択してください</option>
            {scales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">リンクURL</label>
          <input type="url" name="link" className="w-full border rounded px-2 py-1" value={form.link} onChange={handleChange} placeholder="https://example.com" />
        </div>
        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded font-bold hover:bg-pink-400 transition">{editData ? '編集を保存' : '投稿'}</button>
        {editData && (
          <button type="button" className="w-full mt-2 bg-gray-200 text-pink-700 py-2 rounded font-bold hover:bg-gray-300 transition" onClick={() => onDelete && onDelete(editData.id)}>
            削除
          </button>
        )}
      </form>
    </div>
  );
}

function App() {
  const [userEvents, setUserEvents] = useState([]); // 投稿イベント
  const [editEvent, setEditEvent] = useState(null); // 編集中イベント

  // 投稿・編集
  const handleEventSubmit = (eventData) => {
    if (eventData.id) {
      // 編集
      setUserEvents(prev => prev.map(ev => ev.id === eventData.id ? eventData : ev));
    } else {
      // 新規投稿
      const newEvent = { ...eventData, id: Date.now() };
      setUserEvents(prev => [...prev, newEvent]);
    }
    setEditEvent(null);
  };
  // 削除
  const handleEventDelete = (id) => {
    if (window.confirm('本当に削除しますか？')) {
      setUserEvents(prev => prev.filter(ev => ev.id !== id));
    }
  };

  // 投稿・既存イベントを合成
  const allEvents = [...events, ...userEvents];

  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<EventListPage allEvents={allEvents} />} />
          <Route path="/event/:id" element={<EventDetailPage allEvents={allEvents} onEdit={setEditEvent} onDelete={handleEventDelete} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/event-post" element={<EventPostForm onSubmit={handleEventSubmit} editData={editEvent} onDelete={handleEventDelete} />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App
