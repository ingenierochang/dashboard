import React, { useRef, useEffect } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        { errorCorrectionLevel: "H" },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [url]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const imageUrl = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "qrcode.png";
      link.click();
    }
  };

  return (
    <div className="">
      <canvas ref={canvasRef} />
      <button
        onClick={downloadQRCode}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Descargar
      </button>
    </div>
  );
};

export default QRCodeGenerator;
