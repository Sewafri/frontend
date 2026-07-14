interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
  bg: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#ff4d4d", bg: "bg-red-100" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#f5a623", bg: "bg-amber-100" };
  if (score <= 3) return { score: 3, label: "Good", color: "#f5a623", bg: "bg-amber-100" };
  if (score <= 4) return { score: 4, label: "Strong", color: "#0a7c42", bg: "bg-green-100" };
  return { score: 5, label: "Very strong", color: "#0a7c42", bg: "bg-green-100" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;
  const { score, label, color, bg } = getStrength(password);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{ backgroundColor: bar <= score ? color : "#e5e7eb" }}
          />
        ))}
        <span className="text-[11px] font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}
