import React, { useEffect } from "react";

const InstallPWA = () => {
  useEffect(() => {
    let deferredPrompt;

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const btn = document.getElementById("installBtn");
      btn.style.display = "block";

      btn.addEventListener("click", () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          }
          deferredPrompt = null;
        });
      });
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <button
      id="installBtn"
      style={{ display: "none" }}
      className="fixed bottom-6 right-6 px-4 py-2 bg-green-600 text-white rounded-xl"
    >
      Install App
    </button>
  );
};

export default InstallPWA;
