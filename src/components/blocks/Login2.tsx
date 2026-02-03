"use client";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Route } from 'next';
import { useAuthRole } from "@/components/providers/AuthRoleProvider";

interface Login2Props {
  heading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
}

const ALLOWED_USERS = [
  {
    id: "6719dd78f21ef7a8b05e28a0",
    name: "Admin",
    email: "admin@proplens.ai",
    password: "Win4CDL",
    role: "admin",
    org_id: "6645dc2f76aefc4f72970f05",
    firstLogin: true
  },
  {
    id: "673add3a08735de82e80bc09",
    name: "Proplens Admin",
    email: "proplens.admin@proplens.ai",
    password: "Win4CDL",
    role: "client_super_admin",
    org_id: "6645dc2f76aefc4f72970f05",
    firstLogin: true
  },
  {
    id: "67fe0defb1bb16718f027aab",
    name: "Test",
    email: "test.trial@proplens.ai",
    password: "Win4CDL",
    role: "client_sales_user",
    org_id: "6645dc2f76aefc4f72970f05",
    firstLogin: false
  }
];

const Login2 = ({
  heading = "Login",
  logo,
  buttonText = "Login",
  signupText = "",
  signupUrl = "#",
}: Login2Props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string; }>({
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const router = useRouter();
  const { setRole } = useAuthRole();

  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoginError(null);

    const user = ALLOWED_USERS.find(
      u => u.email === data.email && u.password === data.password
    );

    if (!user) {
      setLoginError("Invalid email or password");
      return;
    }

    document.cookie = 'auth_logged_in=true; path=/; max-age=3600';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userOrgId', user.org_id);
    setRole(null);
    setIsRedirecting(true);
    router.push('/ask-buddy' as Route);
  };

  return (
    <section className="min-h-[100dvh] grid place-items-center px-4 bg-[--color-neutral-50]">
      <div className="w-full max-w-[450px] flex flex-col items-center">
        {logo?.src && (
          <a href={logo.url} aria-label={logo.title || logo.alt}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-20 w-auto object-contain" />
          </a>
        )}

        {heading && (
          <h1 className="b-font text-center text-[24px] leading-8 font-semibold tracking-[-0.01em] text-[--color-neutral-900] mt-6">
            {heading}
          </h1>
        )}

        <div className="w-full rounded-[12px] border border-[--color-neutral-200] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.06)] px-5 py-5 md:px-7 md:py-6 mt-6">
          <h2 className="b-font text-center text-[20px] leading-7 font-semibold text-[--color-neutral-900] mb-5">
            Sign in to your account
          </h2>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex w-full flex-col gap-[10px]">
              <Label htmlFor="email" className="text-[13px] font-medium text-[--color-neutral-900]">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                aria-invalid={errors.email ? "true" : "false"}
                className="h-11 rounded-[12px] bg-[--color-neutral-100] border border-transparent text-[14px] text-[--color-neutral-900] placeholder-[--color-neutral-500] px-4 transition-shadow focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-neutral-700)_10%,white)]"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: "Enter a valid email" },
                })}
              />
              {errors.email && (
                <p className="text-[12px] text-[--color-danger]" role="alert">{errors.email.message}</p>
              )}
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="password" className="text-[13px] font-medium text-[--color-neutral-900]">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  aria-invalid={errors.password ? "true" : "false"}
                  className="h-11 pr-10 rounded-[12px] bg-[--color-neutral-100] border border-transparent text-[14px] text-[--color-neutral-900] placeholder-[--color-neutral-500] pl-4 transition-shadow focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-neutral-700)_10%,white)]"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-[--color-neutral-500] hover:text-[--color-neutral-700]"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-[--color-danger]" role="alert">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-[13px] leading-5">
              <label className="inline-flex items-center gap-2 select-none leading-5 text-[--color-neutral-900] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[--color-neutral-300] cursor-pointer"
                />
                <span className="font-semibold">Remember me</span>
              </label>
              <a href="#" className="text-[--color-primary] font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting || isRedirecting} className="w-full h-[44px] rounded-[10px] text-white text-[15px] font-semibold">
              {isSubmitting || isRedirecting ? 'Logging in...' : buttonText}
            </Button>
          </form>
        </div>
        {signupText && (
          <p className="b-font mt-5 text-center text-[13px] text-[--color-neutral-600]">
            {signupText} <a className="text-[--color-primary] font-medium hover:underline" href={signupUrl}>Sign up</a>
          </p>
        )}
      </div>
    </section>
  );
};

export { Login2 };
