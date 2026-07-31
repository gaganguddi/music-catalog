import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Music2, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      login(res.data.token);
      toast.success("Welcome back! 🎵");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-scale-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Music2 size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
              MusicVault
            </span>
          </div>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your music catalog</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
              />
              <input
                id="login-email"
                type="email"
                className="input-field"
                style={{ paddingLeft: "40px" }}
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                })}
              />
            </div>
            {errors.email && (
              <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
              />
              <input
                id="login-password"
                type="password"
                className="input-field"
                style={{ paddingLeft: "40px" }}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && (
              <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            id="btn-login"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ padding: "13px 20px", fontSize: "0.95rem", marginTop: "8px" }}
          >
            {loading ? (
              <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Signing in…</>
            ) : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
