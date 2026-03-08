import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface Props {
  password: string;
}

const PasswordStrengthMeter = ({ password }: Props) => {
  const { score, label, color } = useMemo(() => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;

    if (s <= 1) return { score: 20, label: "Weak", color: "text-destructive" };
    if (s === 2) return { score: 40, label: "Fair", color: "text-secondary" };
    if (s === 3) return { score: 60, label: "Good", color: "text-secondary" };
    if (s === 4) return { score: 80, label: "Strong", color: "text-primary" };
    return { score: 100, label: "Very Strong", color: "text-primary" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <Progress value={score} className="h-2" />
      <p className={`text-xs font-medium ${color}`}>{label}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
