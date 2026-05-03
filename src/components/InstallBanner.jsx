import { useEffect, useState } from "react";

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      setShow(false);
    }

    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div style={styles.box}>
      <div>
        <h3>🍜 Gunnu Chinese Corner</h3>
        <p>Install the app for the best experience</p>
      </div>

      <button onClick={installApp} style={styles.btn}>
        Install
      </button>
    </div>
  );
}

const styles = {
  box: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#0b0b0b",
    color: "#ffd700",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 0 20px rgba(139,0,0,0.5)",
    zIndex: 9999
  },
  btn: {
    background: "#8b0000",
    color: "#ffd700",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default InstallBanner;