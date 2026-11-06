import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService, extraService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AcademicCalendarWidget } from '../components/AcademicCalendarWidget';
import { User, LogOut, Loader2, Image as ImageIcon, BookOpen, Clock, Award, LayoutDashboard, Search } from 'lucide-react';

export const Dashboard = () => {
  const { userSession, logoutSession } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [kardex, setKardex] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [events, setEvents] = useState([]);
  const [bgUrl, setBgUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [bgInput, setBgInput] = useState('');
  const [showBgModal, setShowBgModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const numeroControl = userSession?.numeroControl;
      if (!numeroControl) {
        navigate('/login');
        return;
      }

      try {
        const [profileData, gradesData, kardexData, scheduleData, eventsData, savedBg] = await Promise.all([
          studentService.getProfile(numeroControl),
          studentService.getGrades(numeroControl),
          studentService.getKardex(numeroControl),
          studentService.getSchedule(numeroControl),
          extraService.getEvents(),
          extraService.getBackground(numeroControl)
        ]);

        setProfile(profileData);
        setGrades(gradesData || []);
        setKardex(kardexData || []);
        setSchedule(scheduleData || []);
        setEvents(eventsData || []);
        if (savedBg) setBgUrl(savedBg);

      } catch (err) {
        console.error('Error al cargar datos de Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userSession, navigate]);

  const handleLogout = () => {
    logoutSession(); // Limpia la sesión en memoria
    navigate('/login');
  };

  const handleSaveBackground = async () => {
    if (!bgInput.trim()) return;
    const numeroControl = userSession?.numeroControl;
    setBgUrl(bgInput);
    setShowBgModal(false);

    if (numeroControl) {
      try {
        await extraService.saveBackground(numeroControl, bgInput);
      } catch (e) {
        console.error('Error al guardar el fondo:', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="text-lg font-medium">Cargando datos desde la memoria...</span>
        </div>
      </div>
    );
  }

  const filteredGrades = grades.filter(m => 
    m.nombre_materia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.clave_materia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKardex = kardex.filter(k => 
    k.nombre_materia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.clave_materia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen bg-neutral-950 text-white transition-all bg-cover bg-center bg-no-repeat relative pb-24"
      style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : 'none' }}
    >
      {bgUrl && <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-0" />}

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        {/* Navbar */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-neutral-900/80 backdrop-blur-md p-4 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">
              ITC
            </div>
            <div>
              <h1 className="font-bold text-lg">Sistema SII ITC</h1>
              <p className="text-xs text-neutral-400 font-mono">Control: {profile?.numero_control}</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/50">
            <button
              onClick={() => setActiveTab('perfil')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeTab === 'perfil' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('calificaciones')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeTab === 'calificaciones' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Calificaciones
            </button>
            <button
              onClick={() => setActiveTab('kardex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeTab === 'kardex' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              <Award className="w-3.5 h-3.5" />
              Kardex
            </button>
            <button
              onClick={() => setActiveTab('horario')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeTab === 'horario' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              <Clock className="w-3.5 h-3.5" />
              Horario
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBgModal(true)}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span>Fondo</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* --- PESTAÑA PERFIL --- */}
        {activeTab === 'perfil' && profile && (
          <div className="bg-neutral-900/80 backdrop-blur-md p-6 rounded-3xl border border-neutral-800">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-neutral-800 rounded-2xl border border-neutral-700 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-neutral-500" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold">{profile.nombre}</h2>
                <p className="text-neutral-400 text-sm mt-1">{profile.email} | Control: <span className="font-mono text-indigo-400">{profile.numero_control}</span></p>
                <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-neutral-800 rounded-xl text-xs border border-neutral-700">Semestre: <strong>{profile.semestre}</strong></span>
                  <span className="px-3 py-1 bg-neutral-800 rounded-xl text-xs border border-neutral-700">Promedio Ponderado: <strong>{profile.promedio_ponderado}</strong></span>
                  <span className="px-3 py-1 bg-neutral-800 rounded-xl text-xs border border-neutral-700">Avance: <strong>{profile.porcentaje_avance}%</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA CALIFICACIONES --- */}
        {activeTab === 'calificaciones' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
              <h2 className="text-lg font-bold">Calificaciones Actuales</h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Buscar materia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGrades.map((mat, i) => (
                <div key={i} className="bg-neutral-900/80 backdrop-blur-md p-5 rounded-2xl border border-neutral-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{mat.clave_materia}</span>
                      <h3 className="font-bold text-base mt-1">{mat.nombre_materia}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center border-t border-neutral-800 pt-3">
                    {[1, 2, 3, 4].map((num) => {
                      const cal = mat[`calificacion_${num}`];
                      let badgeColor = 'bg-neutral-800 text-neutral-400';
                      if (cal !== null && cal !== undefined) {
                        badgeColor = Number(cal) >= 70 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                      }

                      return (
                        <div key={num} className="bg-neutral-800/40 p-2 rounded-xl border border-neutral-800">
                          <div className="text-[10px] text-neutral-400">Parcial {num}</div>
                          <div className={`text-sm font-bold mt-1 py-0.5 rounded-lg border ${badgeColor}`}>
                            {cal ?? '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PESTAÑA KARDEX --- */}
        {activeTab === 'kardex' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
              <h2 className="text-lg font-bold">Historial Académico (Kardex)</h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Buscar en Kardex..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-800/60 text-neutral-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Sem</th>
                      <th className="p-3">Clave</th>
                      <th className="p-3">Materia</th>
                      <th className="p-3">Créditos</th>
                      <th className="p-3">Calificación</th>
                      <th className="p-3">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredKardex.map((item, idx) => (
                      <tr key={idx} className="hover:bg-neutral-800/30">
                        <td className="p-3 font-mono text-neutral-400">{item.semestre}</td>
                        <td className="p-3 font-mono text-indigo-400">{item.clave_materia}</td>
                        <td className="p-3 font-medium text-white">{item.nombre_materia}</td>
                        <td className="p-3">{item.creditos}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${Number(item.calificacion) >= 70 || item.calificacion === 'AC' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {item.calificacion}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400">{item.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA HORARIO --- */}
        {activeTab === 'horario' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Horario de Clases Semestral</h2>
            <div className="grid grid-cols-1 gap-4">
              {schedule.map((item, i) => (
                <div key={i} className="bg-neutral-900/80 backdrop-blur-md p-5 rounded-2xl border border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{item.clave_materia}</span>
                    <h3 className="font-bold text-base mt-1">{item.nombre_materia}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.lunes && <span className="bg-neutral-800 px-3 py-1.5 rounded-xl"><strong>Lun:</strong> {item.lunes} ({item.lunes_salon})</span>}
                    {item.martes && <span className="bg-neutral-800 px-3 py-1.5 rounded-xl"><strong>Mar:</strong> {item.martes} ({item.martes_salon})</span>}
                    {item.miercoles && <span className="bg-neutral-800 px-3 py-1.5 rounded-xl"><strong>Mié:</strong> {item.miercoles} ({item.miercoles_salon})</span>}
                    {item.jueves && <span className="bg-neutral-800 px-3 py-1.5 rounded-xl"><strong>Jue:</strong> {item.jueves} ({item.jueves_salon})</span>}
                    {item.viernes && <span className="bg-neutral-800 px-3 py-1.5 rounded-xl"><strong>Vie:</strong> {item.viernes} ({item.viernes_salon})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Fondo */}
      {showBgModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Fondo de Pantalla Personalizado</h3>
            <p className="text-xs text-neutral-400 mb-4">Ingresa la URL de la imagen que deseas establecer como fondo.</p>
            <input
              type="text"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={bgInput}
              onChange={(e) => setBgInput(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-white text-sm mb-4 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBgModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBackground}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium rounded-xl"
              >
                Guardar Fondo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget del Calendario */}
      <AcademicCalendarWidget events={events} />
    </div>
  );
};