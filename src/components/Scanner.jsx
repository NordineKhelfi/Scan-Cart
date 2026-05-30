import React, { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export default function Scanner({ onScan }) {
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    let isScanned = false;
    let shouldStop = false;
    
    const startScanner = async () => {
      try {
        html5QrCodeRef.current = new Html5Qrcode("reader");
        await html5QrCodeRef.current.start(
          { facingMode: "environment" }, 
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.CODE_128,
            ],
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!isScanned) {
              isScanned = true;
              onScan(decodedText);
              setTimeout(() => { isScanned = false; }, 2000);
            }
          },
          () => {} // ignore scan failures silently
        );

        if (shouldStop) {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current.clear();
        }
      } catch (err) {
        console.error("Error starting scanner: ", err);
      }
    };
    
    startScanner();

    return () => {
      shouldStop = true;
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        }).catch(e => console.error(e));
      }
    };
  }, [onScan]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '55vh', flexShrink: 0, backgroundColor: '#000', overflow: 'hidden' }}>
      <div id="reader" style={{ width: '100%', height: '100%', border: 'none' }}></div>
      <style>{`
        #reader { width: 100% !important; border: none !important; }
        #reader video { 
          object-fit: cover !important; 
          width: 100% !important; 
          height: 100% !important; 
          position: absolute; 
          top: 0; 
          left: 0; 
          transform: translateZ(0); 
        }
      `}</style>
    </div>
  );
}
