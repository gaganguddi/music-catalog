import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Music2, Mail, Lock, User, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      login(res.data.token);
      toast.success("Account created! Let's build your catalog 🎵");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
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

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start cataloging your music collection</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <div className="input-group">
            <label className="input-label" htmlFor="register-name">Full Name</label>
            <div style={{ position: "relative" }}>
              <User
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
              />
              <input
                id="register-name"
                type="text"
                className="input-field"
                style={{ paddingLeft: "40px" }}
                placeholder="John Doe"
                autoComplete="name"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && (
              <span style={{ color: "var(--danger)", fontSize: "0.78rem" }}>
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label" htmlFor="register-email">Email</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
              />
              <input
                id="register-email"
                type="email"
                className="input-field"
                style={{ paddingLeft: "40px" }}
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
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
            <label className="input-label" htmlFor="register-password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
              />
              <input
                id="register-password"
                type="password"
                className="input-field"
                style={{ paddingLeft: "40px" }}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
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
            id="btn-register"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ padding: "13px 20px", fontSize: "0.95rem", marginTop: "8px" }}
          >
            {loading ? (
              <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Creating account…</>
            ) : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;