import React, { useState, useEffect } from 'react';
import { Calendar, Download, X } from 'lucide-react';

export const AcademicCalendarWidget = ({ events = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [todayEvents, setTodayEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!events.length) return;

    const todays = events.filter(e => e.start_date === todayStr);
    setTodayEvents(todays);

    const upcoming = events
      .filter(e => e.start_date >= todayStr)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0];

    setNextEvent(upcoming);
  }, [events, todayStr]);

  // NUEVA FUNCIÓN PARA IMPRIMIR / DESCARGAR EN PDF
  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    
    const pdfTemplate = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Calendario Académico ITC 2026</title>
        <style>
          @page { margin: 15mm; size: portrait; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 10px; }
          
          /* Encabezado Institucional TecNM */
          .top-bar { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #1b396a; padding-bottom: 8px; margin-bottom: 15px; }
          .inst-name { font-size: 13pt; font-weight: 800; color: #1b396a; text-transform: uppercase; letter-spacing: 0.5px; }
          .inst-sub { font-size: 9pt; color: #64748b; font-weight: 600; }
          .period-badge { background: #1b396a; color: white; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 10pt; text-transform: uppercase; }
          
          /* Tarjetas de fechas clave */
          .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .card { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; background: #f8fafc; }
          .card-title { font-size: 7.5pt; font-weight: 700; color: #64748b; uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .card-value { font-size: 10pt; font-weight: 800; color: #0f172a; }
          
          /* Secciones */
          .section-title { font-size: 10pt; font-weight: 800; color: #1b396a; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 15px; margin-bottom: 8px; border-left: 4px solid #1b396a; padding-left: 8px; }
          
          /* Tabla de Eventos */
          table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
          th { background: #f1f5f9; color: #334155; text-transform: uppercase; font-size: 7.5pt; font-weight: 700; padding: 8px; text-align: left; border-bottom: 2px solid #cbd5e1; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          
          /* Badges de Colores */
          .badge { padding: 3px 8px; border-radius: 4px; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; display: inline-block; }
          .badge-asueto { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
          .badge-evaluacion { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
          .badge-evento { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
        </style>
      </head>
      <body>

        <!-- ENCABEZADO OFICIAL -->
        <div class="top-bar">
          <div>
            <div class="inst-name">TECNOLÓGICO NACIONAL DE MÉXICO</div>
            <div class="inst-sub">Instituto Tecnológico de Celaya · Calendario Académico Oficial</div>
          </div>
          <div class="period-badge">Agosto - Diciembre 2026</div>
        </div>

        <!-- RESUMEN DE FECHAS CLAVE -->
        <div class="cards-grid">
          <div class="card">
            <div class="card-title">INICIO DE CURSOS</div>
            <div class="card-value">17 de Agosto</div>
          </div>
          <div class="card">
            <div class="card-title">FIN DE CURSOS</div>
            <div class="card-value">04 de Diciembre</div>
          </div>
          <div class="card">
            <div class="card-title">2ª OPORTUNIDAD</div>
            <div class="card-value">07 al 11 de Dic</div>
          </div>
          <div class="card">
            <div class="card-title">PERIODO VACACIONAL</div>
            <div class="card-value">18 Dic - 08 Ene</div>
          </div>
        </div>

        <!-- TABLA COMPLETA DE EVENTOS Y EVALUACIONES -->
        <div class="section-title">Calendario General de Eventos y Evaluaciones</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30%;">Periodo / Fecha</th>
              <th style="width: 50%;">Actividad / Descripción</th>
              <th style="width: 20%;">Tipo</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(ev => `
              <tr>
                <td><strong>${ev.start_date} ${ev.end_date && ev.end_date !== ev.start_date ? ' al ' + ev.end_date : ''}</strong></td>
                <td>
                  <strong>${ev.title}</strong>
                  ${ev.description ? '<br><small style="color:#64748b">' + ev.description + '</small>' : ''}
                </td>
                <td><span class="badge badge-${ev.type}">${ev.type}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(pdfTemplate);
    printWindow.document.close();
  };

  const getTagColor = (type) => {
    switch (type) {
      case 'asueto': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'evaluacion': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* WIDGET ESTILO MÓVIL (Minimizado) */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="w-72 bg-neutral-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-bold capitalize">
              {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })}
            </div>
            <button className="bg-rose-300/20 text-rose-300 p-1.5 rounded-full hover:bg-rose-300/30">
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-neutral-800/80 p-3 rounded-xl mb-3 text-sm text-neutral-300">
            {todayEvents.length > 0 ? (
              todayEvents.map((ev, i) => (
                <div key={i} className="font-medium text-white">{ev.title}</div>
              ))
            ) : (
              <div className="text-neutral-400 font-normal">No hay nada programado</div>
            )}
          </div>

          {nextEvent && (
            <div>
              <div className="text-xs text-neutral-400 mb-1 capitalize">
                {formatDateLabel(nextEvent.start_date)}
              </div>
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold truncate ${getTagColor(nextEvent.type)}`}>
                {nextEvent.title}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA EXTENDIDA / MODAL */}
      {isOpen && (
        <div className="w-80 md:w-96 bg-neutral-900 text-white p-5 rounded-2xl shadow-2xl border border-neutral-800">
          <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Calendario Oficial ITC</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 mb-4">
            {events.map((ev) => (
              <div key={ev.id} className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-800/80">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-neutral-400 font-mono">
                    {ev.start_date} {ev.end_date && ev.end_date !== ev.start_date ? `al ${ev.end_date}` : ''}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${getTagColor(ev.type)}`}>
                    {ev.type}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">{ev.title}</div>
                {ev.description && <div className="text-xs text-neutral-400 mt-0.5">{ev.description}</div>}
              </div>
            ))}
          </div>

          {/* BOTÓN ACTUALIZADO A DESCARGA EN PDF */}
          <button
            onClick={downloadPDF}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar Calendario (PDF)
          </button>
        </div>
      )}
    </div>
  );
};