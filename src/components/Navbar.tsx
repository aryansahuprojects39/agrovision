import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Disease Detection", href: "/disease-detection" },
  { label: "Weather", href: "/weather" },
  { label: "Schemes", href: "/government-schemes" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AgroVision AI" className="h-9 w-9" />
          <span className="text-lg font-bold text-foreground">AgroVision AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link key={link.href} to={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </a>
            )
          )}
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          {navLinks.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link key={link.href} to={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary py-2">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-primary py-2">
                {link.label}
              </a>
            )
          )}
          {user ? (
            <>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" className="w-full" onClick={() => { handleSignOut(); setOpen(false); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" className="w-full" asChild>
              <Link to="/auth" onClick={() => setOpen(false)}>Get Started</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
