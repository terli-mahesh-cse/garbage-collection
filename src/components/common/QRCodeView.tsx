"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, Download } from "lucide-react";

interface QRCodeViewProps {
  value: string;
  size?: number;
  label?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 200,
  label,
}) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: "#1B5E20",
        light: "#FFFFFF",
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [value, size]);

  const copyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-sm">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR Code"
          className="rounded-xl border border-gray-100 dark:border-slate-700 shadow-inner"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse"
          style={{ width: size, height: size }}
        />
      )}

      {label && (
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 text-center">
          {label}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={copyText}
          className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy Code"}</span>
        </button>

        <button
          onClick={downloadQR}
          className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-slate-700 hover:bg-emerald-100 text-xs font-semibold text-primary dark:text-emerald-300 flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save PNG</span>
        </button>
      </div>
    </div>
  );
};
