import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, Loader2 } from 'lucide-react';
import { ISODocument } from '../../types';
import { askAIAboutISO } from '../../services/geminiService';

interface AIAssistantProps {
  isoDocuments: ISODocument[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isoDocuments }) => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    try {
      const response = await askAIAboutISO(aiQuery, isoDocuments);
      setAiResponse(response);
    } catch (error) {
      setAiResponse('Có lỗi xảy ra khi hỏi AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 border-primary/30 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Bot size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles size={18} />
          </div>
          <h2 className="text-lg font-bold text-white">Trợ lý AI ISO</h2>
        </div>
        
        <p className="text-sm text-text-secondary mb-4">
          Hỏi AI bất cứ điều gì về quy trình, biểu mẫu hoặc nội dung trong hệ thống tài liệu ISO của công ty.
        </p>

        <form onSubmit={handleAiSearch} className="relative mb-4">
          <input
            type="text"
            placeholder="Ví dụ: Quy trình tiếp nhận đơn hàng gồm những bước nào?..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="glass-input w-full pr-12 py-3"
          />
          <button 
            type="submit"
            disabled={isAiLoading || !aiQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-all"
          >
            {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>

        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap"
            >
              <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                <Bot size={16} />
                <span>AI trả lời:</span>
              </div>
              {aiResponse}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
