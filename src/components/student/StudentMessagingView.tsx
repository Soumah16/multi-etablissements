import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  MessageSquare, 
  Send, 
  User, 
  CheckCheck, 
  Paperclip, 
  Smile, 
  Sparkles 
} from 'lucide-react';

export const StudentMessagingView: React.FC = () => {
  const { messages, sendMessage, profile } = useStudent();
  const [inputText, setInputText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('M. Mamadou Lamarana Diallo (Maths)');

  const teachersList = [
    'M. Mamadou Lamarana Diallo (Maths)',
    'M. Ousmane Traoré (Physique-Chimie)',
    'Mme Aminata Camara (Philosophie)',
    'M. Thierno Bah (SVT)',
    'M. Ibrahima Kalil Keïta (Surveillant Général)'
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim(), selectedRecipient);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-blue-950">Messagerie Pédagogique</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Posez vos questions de cours, demandez des éclaircissements sur un exercice ou échangez avec vos professeurs.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden flex flex-col h-[650px]">
        {/* Recipient Selector Topbar */}
        <div className="p-4 bg-slate-50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              {selectedRecipient.charAt(3)}
            </div>
            <div>
              <div className="font-bold text-sm text-blue-950">{selectedRecipient}</div>
              <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Disponible pour les questions académiques</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden md:inline">Changer d'enseignant :</span>
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
            >
              {teachersList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-blue-50/70">
          {messages.map(msg => {
            const isMe = msg.isStudent;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isMe ? 'bg-blue-600 text-white' : 'bg-slate-50 text-amber-700 border border-amber-200'
                }`}>
                  {isMe ? profile.firstName.charAt(0) : 'P'}
                </div>

                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-[10px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-slate-500 font-medium">{msg.sender}</span>
                    <span className="text-slate-500">{msg.time}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md' 
                      : 'bg-blue-50/60 text-slate-900 border border-slate-200 rounded-tl-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-blue-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Écrire un message à ${selectedRecipient}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
