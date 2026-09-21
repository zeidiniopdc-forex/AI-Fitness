import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateAIPrompt } from '../utils/promptGenerator';
import { Brain, Copy, Check, AlertTriangle, ExternalLink } from 'lucide-react';

export default function PromptGenerator() {
  const { activeProfile } = useAppContext();
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  const handleGenerate = () => {
    if (!activeProfile) return;
    const prompt = generateAIPrompt(activeProfile);
    setGeneratedPrompt(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModelUrl = (model: string) => {
    switch (model) {
      case 'chatgpt': return 'https://chat.openai.com';
      case 'gemini': return 'https://gemini.google.com';
      case 'claude': return 'https://claude.ai';
      default: return '';
    }
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className="text-[#f59e0b] mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">پروفایل تکمیل نشده</h2>
        <p className="text-gray-400 text-center">لطفاً ابتدا پروفایل ورزشکار را در بخش پروفایل تکمیل کنید</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain size={22} className="text-[#4a90d9]" />
          تولید پرامپت هوشمند
        </h2>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-l from-[#4a90d9]/10 to-transparent rounded-2xl p-5 border border-[#4a90d9]/20">
        <h3 className="text-[#4a90d9] font-bold mb-2">🧠 چگونه کار می‌کند؟</h3>
        <p className="text-gray-300 text-sm leading-6">
          این ابزار بر اساس اطلاعات پروفایل ورزشکار، یک پرامپت حرفه‌ای و علمی تولید می‌کند که می‌توانید آن را به هر مدل هوش مصنوعی (ChatGPT، Gemini، Claude و ...) ارسال کنید تا برنامه تمرینی سفارشی دریافت کنید.
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
        <h3 className="text-[#d4af37] font-bold mb-3">خلاصه اطلاعات ارسالی</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-gray-400">نام: <span className="text-white">{activeProfile.name}</span></div>
          <div className="text-gray-400">سن: <span className="text-white">{activeProfile.age} سال</span></div>
          <div className="text-gray-400">وزن: <span className="text-white">{activeProfile.weight} کیلو</span></div>
          <div className="text-gray-400">قد: <span className="text-white">{activeProfile.height} سانتی‌متر</span></div>
          <div className="text-gray-400">هدف: <span className="text-white">{activeProfile.primaryGoal}</span></div>
          <div className="text-gray-400">روزهای تمرین: <span className="text-white">{activeProfile.trainingDays} روز</span></div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-l from-[#4a90d9] to-[#6bb5ff] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#4a90d9]/20"
      >
        🚀 تولید پرامپت حرفه‌ای
      </button>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="text-[#22c55e] font-bold">✅ پرامپت تولید شد</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-[#22c55e]/20 text-[#22c55e] px-3 py-1.5 rounded-lg text-sm hover:bg-[#22c55e]/30 transition-all"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'کپی شد!' : 'کپی'}
            </button>
          </div>
          
          <div className="bg-[#0d0d1a] rounded-xl p-4 border border-gray-700 max-h-96 overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap leading-7 font-vazir">
              {generatedPrompt}
            </pre>
          </div>

          {/* AI Model Links */}
          <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
            <h3 className="text-[#d4af37] font-bold mb-3">ارسال به مدل هوش مصنوعی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'chatgpt', name: 'ChatGPT', color: 'from-green-600 to-green-800' },
                { id: 'gemini', name: 'Gemini', color: 'from-blue-600 to-blue-800' },
                { id: 'claude', name: 'Claude', color: 'from-orange-600 to-orange-800' },
              ].map(model => (
                <a
                  key={model.id}
                  href={getModelUrl(model.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedModel(model.id)}
                  className={`bg-gradient-to-l ${model.color} text-white py-3 px-4 rounded-xl text-center font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                >
                  <ExternalLink size={14} />
                  ارسال به {model.name}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-3">
              * پس از باز کردن مدل AI، پرامپت را در آن پیست کنید
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
