import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";

const AppFeedbackContext = createContext({
  notify: () => {},
});

const SLOW_REQUEST_DELAY = 900;
const TOAST_LIFETIME = 4200;

const inferToastTone = (message) => {
  const text = String(message || "").toLowerCase();

  if (
    text.includes("success") ||
    text.includes("successful") ||
    text.includes("approved") ||
    text.includes("saved")
  ) {
    return "success";
  }

  if (
    text.includes("please") ||
    text.includes("cannot") ||
    text.includes("required") ||
    text.includes("warning")
  ) {
    return "warning";
  }

  if (
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("unable") ||
    text.includes("invalid") ||
    text.includes("denied")
  ) {
    return "error";
  }

  return "info";
};

const parseErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const toneClassNames = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-slate-200 bg-white text-slate-900",
};

const toneBadgeClassNames = {
  success: "bg-emerald-500/10 text-emerald-700",
  error: "bg-rose-500/10 text-rose-700",
  warning: "bg-amber-500/10 text-amber-700",
  info: "bg-slate-500/10 text-slate-700",
};

export const useAppFeedback = () => useContext(AppFeedbackContext);

const AppFeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [showBuffering, setShowBuffering] = useState(false);
  const [isOffline, setIsOffline] = useState(
    typeof navigator === "undefined" ? false : !navigator.onLine,
  );
  const activeRequestsRef = useRef(0);
  const timerRef = useRef(null);
  const toastIdRef = useRef(0);

  const clearSlowTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopBuffering = () => {
    activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
    if (activeRequestsRef.current === 0) {
      clearSlowTimer();
      setShowBuffering(false);
    }
  };

  const notify = (message, tone = inferToastTone(message)) => {
    const id = `${Date.now()}-${toastIdRef.current++}`;
    const nextToast = {
      id,
      message: String(message || ""),
      tone,
    };

    setToasts((prev) => [...prev, nextToast]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TOAST_LIFETIME);
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      notify("Internet connection lost. Reconnect to continue.", "error");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      notify(message);
    };

    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        activeRequestsRef.current += 1;

        if (activeRequestsRef.current === 1) {
          clearSlowTimer();
          timerRef.current = window.setTimeout(() => {
            if (activeRequestsRef.current > 0) {
              setShowBuffering(true);
            }
          }, SLOW_REQUEST_DELAY);
        }

        return config;
      },
      (error) => {
        stopBuffering();
        return Promise.reject(error);
      },
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        stopBuffering();
        return response;
      },
      (error) => {
        stopBuffering();

        if (error?.code === "ERR_NETWORK" || !error?.response) {
          notify(parseErrorMessage(error), "error");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      window.alert = originalAlert;
      clearSlowTimer();
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      notify,
    }),
    [],
  );

  return (
    <AppFeedbackContext.Provider value={contextValue}>
      {children}

      {isOffline ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4">
          <div className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 shadow-lg">
            No internet connection. Trying to reconnect...
          </div>
        </div>
      ) : null}

      {/* {showBuffering ? (
        <div className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/32 backdrop-blur-[2px]">
          <div className="w-[min(90vw,22rem)] rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12">
                <span className="absolute inset-0 rounded-full border-4 border-white/15" />
                <span className="absolute inset-0 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Buffering
                </p>
                <p className="mt-2 text-lg font-black">Network is a little slow</p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-cyan-300" />
            </div>
          </div>
        </div>
      ) : null} */}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[130] flex justify-center px-4 sm:justify-end">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur ${toneClassNames[toast.tone]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${toneBadgeClassNames[toast.tone]}`}
                  >
                    {toast.tone}
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-6">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setToasts((prev) => prev.filter((item) => item.id !== toast.id))
                  }
                  className="rounded-full px-2 py-1 text-sm font-bold text-slate-500 transition hover:bg-black/5"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppFeedbackContext.Provider>
  );
};

export default AppFeedbackProvider;
