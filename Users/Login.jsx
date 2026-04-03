import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import AppContext from "../src/Context/AppContext";

const RESEND_SECONDS = 30;

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyAdminOtp, resendAdminOtp } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otpData, setOtpData] = useState({
    challengeToken: "",
    userId: "",
    maskedEmail: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, resendTimer]);

  const canResendOtp = useMemo(
    () => step === "otp" && resendTimer === 0 && Boolean(otpData.challengeToken),
    [otpData.challengeToken, resendTimer, step],
  );

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (step === "password") {
        const result = await login(formData.email, formData.password);

        if (result.success && result.requiresOtp) {
          setOtpData({
            challengeToken: result.challengeToken || "",
            userId: result.userId || "",
            maskedEmail: result.maskedEmail || formData.email,
          });
          setOtp("");
          setStep("otp");
          setResendTimer(RESEND_SECONDS);
          setMessage(result.message || "OTP sent successfully");
        } else if (result.success && result.user?._id) {
          navigate(`/admin/dash?id=${result.user._id}`);
        } else {
          setError(result.message || "Unable to sign in");
        }
        return;
      }

      const result = await verifyAdminOtp(otpData.challengeToken, otp);
      if (result.success && result.user?._id) {
        navigate(`/admin/dash?id=${result.user._id}`);
      } else {
        setError(result.message || "OTP verification failed");
      }
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to complete login");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await resendAdminOtp(otpData.challengeToken);
      if (result.success) {
        setOtpData((prev) => ({
          ...prev,
          challengeToken: result.challengeToken || prev.challengeToken,
          userId: result.userId || prev.userId,
          maskedEmail: result.maskedEmail || prev.maskedEmail,
        }));
        setResendTimer(RESEND_SECONDS);
        setMessage(result.message || "OTP resent successfully");
      } else {
        setError(result.message || "Unable to resend OTP");
      }
    } catch (resendError) {
      setError(resendError.response?.data?.message || "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep("password");
    setOtp("");
    setOtpData({ challengeToken: "", userId: "", maskedEmail: "" });
    setResendTimer(0);
    setMessage("");
    setError("");
  };

  return (
    <form onSubmit={submitHandler} className="w-full space-y-4">
      <div className="text-center">
        <div className="text-xl font-semibold text-slate-900">Admin</div>
        <div className="mt-1 text-sm text-slate-600">
          {step === "password" ? "Sign in to continue" : "Verify OTP to continue"}
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {step === "password" ? (
        <>
          <div>
            <label className="ui-label" htmlFor="admin-email">
              Email
            </label>
            <div className="relative mt-2">
              <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-email"
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                type="email"
                className="ui-input pl-10"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label className="ui-label" htmlFor="admin-password">
              Password
            </label>
            <div className="relative mt-2">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={onChangeHandler}
                type="password"
                className="ui-input pl-10"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <FaEnvelope className="text-slate-500" />
              OTP sent to {otpData.maskedEmail}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Password verified. OTP verify hone ke baad hi admin dashboard open hoga.
            </p>
          </div>

          <div>
            <label className="ui-label" htmlFor="admin-otp">
              Enter OTP
            </label>
            <div className="relative mt-2">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                type="text"
                inputMode="numeric"
                className="ui-input pl-10 tracking-[0.4em]"
                placeholder="000000"
                autoComplete="one-time-code"
                required
                minLength={6}
                maxLength={6}
              />
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading || (step === "otp" && otp.length !== 6)}
        className="ui-btn ui-btn-primary w-full justify-center py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? step === "password"
            ? "Sending OTP..."
            : "Verifying OTP..."
          : step === "password"
            ? "Send OTP"
            : "Verify OTP"}
      </button>

      {step === "otp" ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="font-medium text-slate-600 transition hover:text-slate-900"
          >
            Change email
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResendOtp || loading}
            className="font-semibold text-indigo-700 transition hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </button>
        </div>
      ) : null}
    </form>
  );
};

export default Login;
