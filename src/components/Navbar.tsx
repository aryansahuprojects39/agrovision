import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Community", href: "/community" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AgroVision AI" className="h-9 w-9" />
          <span className="text-lg font-bold text-hero-dark-foreground">AgroVision AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link key={link.href} to={link.href} className="text-sm font-medium text-hero-dark-foreground/70 hover:text-secondary transition-colors">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className="text-sm font-medium text-hero-dark-foreground/70 hover:text-secondary transition-colors">
                {link.label}
              </a>
            )
          )}
          <ThemeToggle />
          {user ? (
            <>
              <Button size="sm" className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" className="text-hero-dark-foreground/70 hover:text-hero-dark-foreground" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link to="/auth">Contact Us</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button className="text-hero-dark-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-hero-dark/95 backdrop-blur-md border-b border-primary/20 px-4 pb-4 space-y-3">
          {navLinks.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link key={link.href} to={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-hero-dark-foreground/70 hover:text-secondary py-2">
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-hero-dark-foreground/70 hover:text-secondary py-2">
                {link.label}
              </a>
            )
          )}
          {user ? (
            <>
              <Button size="sm" className="w-full rounded-full bg-secondary text-secondary-foreground" asChild>
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" className="w-full text-hero-dark-foreground/70" onClick={() => { handleSignOut(); setOpen(false); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" className="w-full rounded-full bg-secondary text-secondary-foreground" asChild>
              <Link to="/auth" onClick={() => setOpen(false)}>Contact Us</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
