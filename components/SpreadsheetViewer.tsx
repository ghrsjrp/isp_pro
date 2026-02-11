
import React, { useState } from 'react';
import { FileText, Upload, Trash2, Eye } from 'lucide-react';

interface HTMLSheet {
  id: string;
  name: string;
  content: string;
}

const SpreadsheetViewer: React.FC = () => {
  const [sheets, setSheets] = useState<HTMLSheet[]>([]);
  const [activeSheet, setActiveSheet] = useState<HTMLSheet | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly cast to File[] to avoid 'unknown' type errors on the iterator
    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newSheet = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: content
        };
        setSheets(prev => [...prev, newSheet]);
      };
      reader.readAsText(file);
    });
  };

  const removeSheet = (id: string) => {
    setSheets(prev => prev.filter(s => s.id !== id));
    if (activeSheet?.id === id) setActiveSheet(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Visualizador de Planilhas HTML</h2>
            <p className="text-sm text-slate-400 font-medium">Importe as abas exportadas do Excel para consulta rápida.</p>
          </div>
          <label className="cursor-pointer flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Upload size={18} />
            <span>Selecionar Arquivos .html</span>
            <input type="file" multiple accept=".html" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {sheets.length === 0 ? (
          <div className="border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <p className="text-slate-400 font-medium">Nenhuma planilha carregada nesta sessão.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sheets.map(sheet => (
              <div 
                key={sheet.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  activeSheet?.id === sheet.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl ${activeSheet?.id === sheet.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <FileText size={20} />
                  </div>
                  <button onClick={() => removeSheet(sheet.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="font-bold text-slate-700 truncate mb-4" title={sheet.name}>{sheet.name}</p>
                <button 
                  onClick={() => setActiveSheet(sheet)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeSheet?.id === sheet.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50'
                  }`}
                >
                  <Eye size={14} /> Visualizar Aba
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeSheet && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="px-8 py-4 bg-slate-900 text-white flex justify-between items-center">
            <span className="font-bold tracking-tight uppercase text-xs tracking-widest opacity-80">Visualizando: {activeSheet.name}</span>
            <button onClick={() => setActiveSheet(null)} className="text-slate-400 hover:text-white transition-colors">Fechar</button>
          </div>
          <div className="p-4 overflow-auto max-h-[800px]">
             {/* Usamos iframe para isolar o CSS da planilha exportada pelo Excel que costuma ser poluído */}
             <iframe 
               srcDoc={activeSheet.content} 
               className="w-full min-h-[600px] border-none"
               title="Sheet Content"
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetViewer;
