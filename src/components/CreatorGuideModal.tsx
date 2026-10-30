import React, { useState } from 'react';
import { HelpCircle, X, Check, Copy, Camera } from 'lucide-react';
import { PhotoUploadModal } from './PhotoUploadModal';

export const CreatorGuideModal: React.FC = () => {
  if (!import.meta.env.DEV) return null;
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyConfigPath = () => {
    navigator.clipboard?.writeText('src/data/birthdayContent.ts');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Discreet floating helper pill for Gourav */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open creator setup guide"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 border border-[#F7DCE8] text-xs font-medium backdrop-blur-md shadow-xs transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#BD779A]" />
          <span>Creator Guide</span>
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Close guide"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 id="guide-title" className="font-serif text-2xl text-[#513E51] font-semibold">
                  A Little World for Kavisha — Creator Guide
                </h3>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Hi Gourav! Everything on this site is configured to make Kavisha's 19th birthday unforgettable, elegant, and completely personal. Here is your quick checklist:
              </p>

              <div className="space-y-3 text-xs">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <div className="font-semibold text-[#925A7A] flex items-center gap-1.5">
                    <span>1. Replace Placeholder Text & Captions</span>
                  </div>
                  <p className="text-stone-600">
                    All messages, timeline memories, and wishes are kept in:
                  </p>
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-rose-200 font-mono text-[11px] text-stone-700 mt-1">
                    <span>src/data/birthdayContent.ts</span>
                    <button
                      type="button"
                      onClick={copyConfigPath}
                      className="text-[#925A7A] hover:text-[#513E51] flex items-center gap-1 font-sans text-[10px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                  <div className="font-semibold text-purple-900 flex items-center justify-between">
                    <span>2. Private Photo Studio (Unlimited Photos)</span>
                  </div>
                  <p className="text-stone-600">
                    You can upload as many photos as you want! They will automatically display in the hero slideshow and gallery. Public visitors cannot upload or modify photos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#BD779A] hover:bg-[#925A7A] text-white text-[11px] font-medium shadow-xs transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Private Photo Studio (Add / Delete Photos) ✨</span>
                  </button>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <div className="font-semibold text-emerald-900">
                    3. Countdown Target
                  </div>
                  <p className="text-stone-600">
                    Target is fixed to <strong>30 October 2026 at 12:00 AM IST</strong> (Asia/Kolkata). Prior to that timestamp, visitors will only see the locked countdown. You can preview the full experience anytime with the "Preview Unlock" button or by appending <code className="font-mono text-emerald-800">?previewUnlock=1</code> to the URL!
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <div className="font-semibold text-amber-900">
                    4. Secret Letter Security
                  </div>
                  <p className="text-stone-600">
                    The <strong className="text-amber-900">WHAT IF</strong> easter egg is unlocked using password <code className="font-mono text-amber-800 font-bold">Feelings</code>. The sealed royal scroll letter inside is unlocked using password <code className="font-mono text-amber-800 font-bold">Attachment</code>.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#925A7A] hover:bg-[#7f4b69] text-white text-xs font-medium cursor-pointer"
                >
                  Got it, close guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </>
  );
};
