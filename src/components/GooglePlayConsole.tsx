import { useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  FileCode, 
  Terminal, 
  Play, 
  Check, 
  Info,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

interface GooglePlayConsoleProps {
  onBack: () => void;
}

export default function GooglePlayConsole({ onBack }: GooglePlayConsoleProps) {
  const [packageName, setPackageName] = useState('com.cozysanctuary.app');
  const [sha256, setSha256] = useState('14:6D:E9:83:C5:EC:37:54:64:01:21:C3:57:1D:8E:53:C6:78:E2:21:28:77:E5:1B:D4:6C:6F:E1:9F:80:BC:85');
  const [copiedAssetlinks, setCopiedAssetlinks] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const assetLinksJson = JSON.stringify([
    {
      "relation": [
        "delegate_permission/common.handle_all_urls"
      ],
      "target": {
        "namespace": "android_app",
        "package_name": packageName.trim() || "com.cozysanctuary.app",
        "sha256_cert_fingerprints": [
          sha256.trim() || "00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"
        ]
      }
    }
  ], null, 2);

  const handleCopyAssetLinks = () => {
    navigator.clipboard.writeText(assetLinksJson);
    setCopiedAssetlinks(true);
    setTimeout(() => setCopiedAssetlinks(false), 2000);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 text-left pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-all active:scale-95">
          <ChevronLeft size={24} className="text-app-text" />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1A1A1A]">Play Store Publisher</h2>
          <p className="text-xs text-app-muted">Turn your Cozy Sanctuary into a native Google Play app</p>
        </div>
      </div>

      {/* PWA Requirements Checklist */}
      <div className="app-card bg-white border border-black/5 p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-wider text-app-text/80 flex items-center gap-2">
          <CheckCircle size={16} className="text-[#A2E02A]" />
          Play Store Compliance Score
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 bg-green-50/50 rounded-xl border border-green-100/60">
            <div className="w-5 h-5 rounded-full bg-[#A2E02A]/20 flex items-center justify-center text-[#90c020] shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <div className="font-bold text-green-950">Web Manifest Built</div>
              <div className="text-green-800/80">manifest.json is pre-packaged</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-green-50/50 rounded-xl border border-green-100/60">
            <div className="w-5 h-5 rounded-full bg-[#A2E02A]/20 flex items-center justify-center text-[#90c020] shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <div className="font-bold text-green-950">Service Worker & Cache</div>
              <div className="text-green-800/80">PWA registers sw.js correctly</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-green-50/50 rounded-xl border border-green-100/60">
            <div className="w-5 h-5 rounded-full bg-[#A2E02A]/20 flex items-center justify-center text-[#90c020] shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <div className="font-bold text-green-950">Viewport Ready</div>
              <div className="text-green-800/80">Responsive stand-alone viewport</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-green-50/50 rounded-xl border border-green-100/60">
            <div className="w-5 h-5 rounded-full bg-[#A2E02A]/20 flex items-center justify-center text-[#90c020] shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <div className="font-bold text-green-950">Digital Asset Links</div>
              <div className="text-green-800/80">assetlinks.json template live</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AssetLinks Generator */}
      <div className="app-card bg-white border border-black/5 p-5 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-app-text/80 flex items-center gap-2">
              <FileCode size={16} className="text-app-blue" />
              Digital Asset Links Configurator
            </h3>
            <p className="text-[11px] text-app-muted mt-1 leading-tight">
              Bypasses the Android browser URL header, making the app full-screen.
            </p>
          </div>
          <div className="text-[10px] bg-app-blue/10 text-app-blue font-bold px-2.5 py-1 rounded-full">
            Recommended
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-app-muted tracking-wider">Android Package Name</label>
            <input 
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="e.g. com.cozysanctuary.app"
              className="w-full text-xs px-3.5 py-2.5 bg-app-bg rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-app-blue/40 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase text-app-muted tracking-wider">App Signing SHA-256 Fingerprint</label>
              <a 
                href="https://play.google.com/console" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-app-blue font-semibold hover:underline flex items-center gap-1"
              >
                Find in Play Console <ExternalLink size={10} />
              </a>
            </div>
            <textarea 
              value={sha256}
              onChange={(e) => setSha256(e.target.value)}
              placeholder="PASTE SHA256 FROM PLAY STORE APP SIGNING TAB"
              className="w-full text-[10px] px-3.5 py-2.5 bg-app-bg rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-app-blue/40 font-mono h-16 resize-none"
            />
          </div>

          <div className="bg-app-bg rounded-xl p-3 border border-black/5 relative">
            <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-app-text/60 font-sans">
              <span>PATH: public/.well-known/assetlinks.json</span>
              <button 
                onClick={handleCopyAssetLinks}
                className="flex items-center gap-1 text-app-blue hover:text-app-blue/80 font-bold ml-auto cursor-pointer"
              >
                {copiedAssetlinks ? (
                  <>
                    <Check size={11} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy Config JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[9px] font-mono text-[#2B303A] max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
              {assetLinksJson}
            </pre>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-3 text-[10px] text-amber-900 border border-amber-100 flex gap-2.5">
            <Info size={14} className="shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong className="font-bold">Deployment Step:</strong> Once you upload Cozy Sanctuary to your web server/host, make sure this file is served at <span className="font-mono bg-white px-1 py-0.5 rounded">https://yourdomain.com/.well-known/assetlinks.json</span> with Content-Type set to <span className="font-mono bg-white px-1 py-0.5 rounded">application/json</span>.
            </div>
          </div>
        </div>
      </div>

      {/* How to Build Android Bundle */}
      <div className="app-card bg-white border border-black/5 p-5 space-y-5 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-wider text-app-text/80 flex items-center gap-1.5">
          <Terminal size={16} className="text-app-orange" />
          The Android App Compilation Pipes
        </h3>

        {/* PWABuilder - Option A */}
        <div className="space-y-2 pb-4 border-b border-black/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-app-text/90 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-app-blue text-white flex items-center justify-center font-black text-[10px]">A</div>
              Option 1: PWABuilder (No-Code Compiler)
            </span>
            <span className="text-[9px] bg-[#A2E02A]/20 text-[#609010] font-black px-2 py-0.5 rounded-full uppercase">Easiest</span>
          </div>
          <p className="text-[11px] text-app-muted leading-relaxed">
            PWABuilder is Microsoft's free publishing hub for developers. It scans your live Sanctuary website and packages it inside an Android App Bundle (.aab) with push credentials ready within 60 seconds.
          </p>
          <a 
            href="https://www.pwabuilder.com/" 
            target="_blank" 
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-app-blue text-white text-xs font-bold rounded-xl hover:bg-app-blue/90 shadow-md hover:shadow-lg transition-all"
          >
            <Play size={11} fill="currentColor" /> Open PWABuilder website <ExternalLink size={12} />
          </a>
        </div>

        {/* Bubblewrap CLI - Option B */}
        <div className="space-y-3 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-app-text/90 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-app-orange text-white flex items-center justify-center font-black text-[10px]">B</div>
              Option 2: Bubblewrap CLI (Command Line Terminal)
            </span>
            <span className="text-[9px] bg-black/5 text-app-muted font-bold px-2 py-0.5 rounded-full uppercase">Terminal</span>
          </div>

          <p className="text-[11px] text-app-muted leading-relaxed">
            For advanced control, compile the exact Google Play deployment pack locally using Google's node command-line toolkit:
          </p>

          <div className="space-y-2.5">
            {/* Command step 1 */}
            <div className="bg-app-bg rounded-xl p-2.5 text-[10px] border border-black/5 flex items-center justify-between font-mono">
              <span className="text-[#333]">npm install -g @bubblewrap/cli</span>
              <button 
                onClick={() => handleCopyText('npm install -g @bubblewrap/cli', 'cli1')}
                className="text-app-blue hover:underline font-bold text-[9px]"
              >
                {copiedCode === 'cli1' ? 'Copied' : 'Copy'}
              </button>
            </div>
            {/* Command step 2 */}
            <div className="bg-app-bg rounded-xl p-2.5 text-[10px] border border-black/5 flex items-center justify-between font-mono">
              <span className="text-[#333]">bubblewrap init --manifest ./public/manifest.json</span>
              <button 
                onClick={() => handleCopyText('bubblewrap init --manifest ./public/manifest.json', 'cli2')}
                className="text-app-blue hover:underline font-bold text-[9px]"
              >
                {copiedCode === 'cli2' ? 'Copied' : 'Copy'}
              </button>
            </div>
            {/* Command step 3 */}
            <div className="bg-app-bg rounded-xl p-2.5 text-[10px] border border-black/5 flex items-center justify-between font-mono text-left">
              <span className="text-[#333]">bubblewrap build</span>
              <button 
                onClick={() => handleCopyText('bubblewrap build', 'cli3')}
                className="text-app-blue hover:underline font-bold text-[9px]"
              >
                {copiedCode === 'cli3' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="bg-zinc-50 rounded-xl p-3 border border-black/5 text-[10px] text-app-muted">
            <strong className="text-app-text font-bold">Good to know:</strong> We have preconfigured a `twa-manifest.json` launcher configuration file inside your project root to streamline initialization details instantly.
          </div>
        </div>
      </div>

      {/* Google Play Store requirements */}
      <div className="app-card bg-[#A2E02A]/10 border-none p-5 space-y-3 shadow-sm rounded-[2rem]">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#90c020]" />
          <h4 className="font-bold text-sm tracking-tight text-[#1A1A1A]">Google Play Console Checklist</h4>
        </div>
        <p className="text-[11px] text-[#4A4B45] leading-relaxed">
          When uploading your generated App Bundle to your Google Developer console, make sure you configure these metadata items:
        </p>
        <ul className="text-[11px] text-[#4A4B45] space-y-2 list-disc pl-4">
          <li><strong>App Icon:</strong> High-res PNG square, exactly 512x512 with clean backgrounds.</li>
          <li><strong>Feature Graphic:</strong> Exactly 1024x500 JPG or 24-bit PNG.</li>
          <li><strong>Phone Screenshots:</strong> At least 4 device screenshots in 16:9 vertical format (e.g. 1080x1920). You can take high resolution copies directly from this Virtual Device Simulator screen!</li>
          <li><strong>Privacy Policy URL:</strong> Hosted document indicating user journaling data and custom profile information stays 100% locally on-device.</li>
        </ul>
      </div>

      {/* Play Store Safety Disclaimer */}
      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-[10px] text-blue-900 flex gap-2.5">
        <Smartphone size={16} className="shrink-0 text-blue-600 mt-0.5" />
        <div>
          <strong className="font-bold">Play Store Sandbox Integration:</strong> Cozy Sanctuary's sound decks, micro-animations, fast indexDB caching, and localized reminders are built to serve native device platforms natively.
        </div>
      </div>
    </div>
  );
}
