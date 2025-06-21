import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import EventDetail from './EventDetail';
import { User, Event, UserContextType, EventFormData } from './types';

// ユーザーとお気に入り情報のContext
export const UserContext = createContext<UserContextType | undefined>(undefined);

// 仮ユーザーデータ（本来はAPI管理）
const mockUsers: User[] = [
  {
    id: 1,
    name: 'テストユーザー',
    email: 'test@example.com',
    password: 'password',
    favorites: [1, 3],
  },
];

const genres = ['ロック', 'ポップ', 'ジャズ', 'クラシック', 'EDM'];
const regions = ['北海道', '東北', '東京', '大阪'];

/** ログイン/新規登録ページ */
function AuthPage() {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used within UserProvider');
  const { login } = userContext;
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  // ログイン用state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // 新規登録用state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockUsers.find(u => u.email === loginEmail && u.password === loginPassword);
    if (found) {
      login(found);
      navigate('/');
    } else {
      alert('メールアドレスまたはパスワードが違います');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
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
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used within UserProvider');
  const { user, logout } = userContext;
  
  const [showModal, setShowModal] = useState(false);

  const handlePostClick = (e: React.MouseEvent) => {
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
    <footer className="w-full bg-pink-100 py-4 text-center text-pink-700">
      <p>&copy; 2024 Music Events. All rights reserved.</p>
    </footer>
  );
}

/** お気に入りボタン */
function Star({ filled, onClick }: { filled: boolean; onClick: () => void }) {
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

/** カレンダービュー */
function CalendarView({ events }: { events: Event[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-pink-600 hover:text-pink-400">←</button>
        <h2 className="text-xl font-bold text-pink-700">{currentDate.getFullYear()}年{monthNames[currentDate.getMonth()]}</h2>
        <button onClick={nextMonth} className="text-pink-600 hover:text-pink-400">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-pink-600 p-2">{day}</div>
        ))}
        {days.map((day, index) => (
          <div key={index} className={`p-2 min-h-[60px] border ${day ? 'bg-white' : 'bg-gray-50'}`}>
            {day && (
              <>
                <div className="text-sm font-medium">{day.getDate()}</div>
                {getEventsForDate(day).map(event => (
                  <div key={event.id} className="text-xs bg-pink-100 text-pink-700 p-1 rounded mt-1 truncate">
                    {event.name}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** アーティストブロックリスト */
function ArtistBlockList({ events, artistFavorites, toggleArtistFavorite }: { 
  events: Event[]; 
  artistFavorites: string[]; 
  toggleArtistFavorite: (artist: string) => void; 
}) {
  const allArtists = Array.from(new Set(events.flatMap(event => event.artists))).sort();

  function getArtistUrl(name: string) {
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' 音楽')}`;
  }

  function ArtistAvatar({ name }: { name: string }) {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    const colors = ['bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-12 h-12 rounded-full ${colors[colorIndex]} flex items-center justify-center text-pink-700 font-bold text-lg`}>
        {initials}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-pink-700 mb-4">アーティスト一覧</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allArtists.map(artist => (
          <div key={artist} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-pink-50 transition">
            <ArtistAvatar name={artist} />
            <div className="flex-1">
              <h3 className="font-semibold text-pink-700">{artist}</h3>
              <a 
                href={getArtistUrl(artist)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                詳細検索
              </a>
            </div>
            <Star
              filled={artistFavorites.includes(artist)}
              onClick={() => toggleArtistFavorite(artist)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** イベントリストページ */
function EventListPage({ allEvents, loading, error }: { 
  allEvents: Event[]; 
  loading: boolean; 
  error: string | null; 
}) {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used within UserProvider');
  const { user, toggleFavorite, artistFavorites, toggleArtistFavorite } = userContext;
  
  const [filterGenre, setFilterGenre] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'artists'>('list');

  const filteredEvents = allEvents.filter(event => {
    if (filterGenre && event.genre !== filterGenre) return false;
    if (filterRegion && event.region !== filterRegion) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-pink-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-pink-600 text-xl">読み込み中...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-pink-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600 text-xl">エラー: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <h1 className="text-3xl font-bold text-pink-700">音楽イベント一覧</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700'}`}
              >
                リスト
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded ${viewMode === 'calendar' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700'}`}
              >
                カレンダー
              </button>
              <button
                onClick={() => setViewMode('artists')}
                className={`px-4 py-2 rounded ${viewMode === 'artists' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700'}`}
              >
                アーティスト
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">すべてのジャンル</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">すべての地域</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-pink-700">{event.name}</h2>
                    {user && (
                      <Star
                        filled={user.favorites.includes(event.id)}
                        onClick={() => toggleFavorite(event.id)}
                      />
                    )}
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>日時:</strong> {event.date} {event.time}</p>
                    <p><strong>場所:</strong> {event.location}</p>
                    <p><strong>ジャンル:</strong> {event.genre}</p>
                    <p><strong>価格:</strong> {event.price}</p>
                  </div>
                  <Link
                    to={`/event/${event.id}`}
                    className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-400 transition"
                  >
                    詳細を見る
                  </Link>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'calendar' && (
            <CalendarView events={filteredEvents} />
          )}

          {viewMode === 'artists' && (
            <ArtistBlockList 
              events={filteredEvents} 
              artistFavorites={artistFavorites} 
              toggleArtistFavorite={toggleArtistFavorite} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** イベント詳細ページ */
function EventDetailPage({ allEvents, onEdit, onDelete }: { 
  allEvents: Event[]; 
  onEdit: (event: Event) => void; 
  onDelete: (id: number) => void; 
}) {
  const { id } = useParams<{ id: string }>();
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used within UserProvider');
  const { user } = userContext;

  const event = allEvents.find(e => e.id === parseInt(id || '0', 10));

  if (!event) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
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
          {user && (
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => onEdit(event)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-400 transition"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400 transition"
              >
                削除
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** ユーザープロバイダー */
function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [artistFavorites, setArtistFavorites] = useState<string[]>([]);

  const login = (userObj: User) => {
    setUser(userObj);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (eventId: number) => {
    if (!user) return;
    const newFavorites = user.favorites.includes(eventId)
      ? user.favorites.filter(id => id !== eventId)
      : [...user.favorites, eventId];
    setUser({ ...user, favorites: newFavorites });
  };

  const toggleArtistFavorite = (artist: string) => {
    setArtistFavorites(prev => 
      prev.includes(artist)
        ? prev.filter(a => a !== artist)
        : [...prev, artist]
    );
  };

  const handleEventSubmit = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    // 実際のアプリケーションではAPIを呼び出す
    console.log('Event submitted:', eventData);
  };

  const handleEventDelete = (id: number) => {
    // 実際のアプリケーションではAPIを呼び出す
    console.log('Event deleted:', id);
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      toggleFavorite,
      artistFavorites,
      toggleArtistFavorite,
      handleEventSubmit,
      handleEventDelete,
    }}>
      {children}
    </UserContext.Provider>
  );
}

/** メインアプリケーション */
function App() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('イベントデータの取得に失敗しました');
      }
      const events = await response.json();
      setAllEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventSubmit = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error('イベントの作成に失敗しました');
      }
      await fetchEvents(); // リストを再取得
    } catch (err) {
      alert(err instanceof Error ? err.message : '不明なエラーが発生しました');
    }
  };

  const handleEventDelete = async (id: number) => {
    if (!confirm('このイベントを削除しますか？')) return;
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('イベントの削除に失敗しました');
      }
      await fetchEvents(); // リストを再取得
    } catch (err) {
      alert(err instanceof Error ? err.message : '不明なエラーが発生しました');
    }
  };

  const handleEdit = (event: Event) => {
    // 編集機能は実装予定
    alert('編集機能は実装予定です');
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EventListPage allEvents={allEvents} loading={loading} error={error} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/event/:id" element={<EventDetailPage allEvents={allEvents} onEdit={handleEdit} onDelete={handleEventDelete} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

function WrappedApp() {
  return <App />;
}

export default WrappedApp; 