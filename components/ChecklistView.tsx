
import React, { useState } from 'react';
import { INITIAL_CHECKLIST, MOCK_ROUTERS, MOCK_SERVICES, MOCK_CONNECTIVITY } from '../constants.tsx';
import { ChecklistItem } from '../types.ts';
import { CheckCircle2, Circle, Sparkles, Loader2, ShieldAlert, Zap, ClipboardCheck } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const ChecklistView: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSummary, setAuditSummary] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  /**
   * Runs AI Audit using Gemini 3 Pro to evaluate ISP configuration.
   */
  const runAiAudit = async () => {
    setIsAuditing(true);
    try {
      // Initialize GoogleGenAI with the API key from environment variables.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inventorySnapshot = {
        backbone: MOCK_ROUTERS,
        stack: MOCK_SERVICES,
        connectivity: MOCK_CONNECTIVITY
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Você é um QA Lead e Arquiteto de Redes de ISP. Analise o inventário técnico e gere um checklist CRÍTICO de auditoria para produção. 
        INVENTÁRIO ATUAL: ${JSON.stringify(inventorySnapshot)}
        Responda obrigatoriamente em JSON com sumário técnico e lista de tarefas (id, category, task, priority, aiReasoning).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    task: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    aiReasoning: { type: Type.STRING }
                  },
                  required: ["id", "category", "task", "priority"]
                }
              }
            },
            required: ["summary", "tasks"]
          }
        }
      });

      // Extract generated text from the response object.
      const result = JSON.parse(response.text || '{}');
      setItems(result.tasks.map((t: any) => ({ ...t, completed: false })));
      setAuditSummary(result.summary);
    } catch (error) {
      console.error("Falha na Auditoria Técnica IA:", error);
      alert("Erro Crítico na Auditoria IA.");
    } finally {
      setIsAuditing(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch(p) {
      case 'High': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <ShieldAlert size={260} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3 tracking-tighter uppercase">
                <ClipboardCheck className="text-indigo-500" size={32} />
                Auditoria de Conformidade
              </h2>
              <p className="text-slate-400 text-sm max-w-lg font-medium">
                Camada 9: Validação autônoma de topologia e serviços baseada em normas RFC e melhores práticas.
              </p>
            </div>
            <button 
              onClick={runAiAudit}
              disabled={isAuditing}
              className="group flex items-center gap-2.5 bg-indigo-600 px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isAuditing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isAuditing ? "Analisando..." : "Rodar Auditoria Técnica"}
            </button>
          </div>
        </div>
      </div>

      {auditSummary && (
        <div className="bg-white border border-indigo-100 p-8 rounded-3xl shadow-sm">
          <h4 className="text-slate-900 font-bold mb-3 flex items-center gap-2 text-lg">
            <ShieldAlert className="text-indigo-600" size={20} /> Relatório de Auditoria
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-2">
            "{auditSummary}"
          </p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => toggleComplete(item.id)}
            className={`flex items-start gap-5 p-6 bg-white rounded-3xl border transition-all cursor-pointer ${
              item.completed ? 'opacity-60 grayscale' : 'hover:border-indigo-200 hover:shadow-xl'
            }`}
          >
            <div className={`mt-1.5 ${item.completed ? 'text-emerald-500' : 'text-slate-200'}`}>
              {item.completed ? <CheckCircle2 size={28} fill="currentColor" /> : <Circle size={28} strokeWidth={1.5} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-black text-slate-400">{item.category}</span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border ${getPriorityBadge(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
              <p className={`text-lg font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {item.task}
              </p>
              {item.aiReasoning && !item.completed && (
                <div className="mt-4 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border flex gap-3">
                  <Zap size={14} className="text-indigo-500 mt-0.5" />
                  <p><strong>Justificativa:</strong> {item.aiReasoning}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistView;
