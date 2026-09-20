import QRCode from "react-qr-code";
import { useRef } from "react";

const QRCodeCard = ({ batchId, verifyUrl }) => {
  const getVerificationUrl = () => {
    if (verifyUrl) {
      return verifyUrl;
    }

    const baseUrl =
      import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin;

    return `${baseUrl}/verify/${batchId}`;
  };

  const url = getVerificationUrl();

  const qrRef = useRef(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 256, 256);

      const link = document.createElement("a");
      link.download = `HoneyChain-${batchId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgStr)));
  };

  if (!batchId) return null;

  return (
    <div className="qr-card">
      <div className="qr-code-wrapper" ref={qrRef}>
        <QRCode value={url} size={160} />
      </div>

      <p className="qr-batch-id">{batchId}</p>

      <button
        className="btn-outline qr-download-btn"
        onClick={handleDownload}
      >
        ⬇ Download QR
      </button>
    </div>
  );
};

export default QRCodeCard;