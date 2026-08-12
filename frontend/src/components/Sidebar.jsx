import NavItem from "./NavItem";

import { logoutUserAction } from "@/actions/auth";

const numberFormatter = new Intl.NumberFormat("en-US");

const getUserInitials = (username) => {
  if (!username) {
    return "?";
  }

  return username
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export default function Sidebar({ user, onNavigate }) {
  const initials = getUserInitials(user?.username);
  const level = user?.level ?? 1;
  const experience = user?.experience ?? 0;
  const experienceRequired = user?.experience_required ?? level * 1000;
  const experiencePercentage = Math.min(100, Math.max(0, user?.experience_percentage ?? 0));

  return (
    <aside className="sidebar">
      <div className="hero-card">
        <div className="hero-avatar">
          <div className="avatar-ring" aria-label={`${user?.username ?? "User"} avatar`}>
            {initials}
          </div>
        </div>

        <div className="hero-name">{user ? user.username.toUpperCase() : "GUEST"}</div>

        <div className="hero-lvl">Lvl. {level}</div>

        <div className="xp-bar-wrap">
          <div className="xp-label">
            <span>Exp</span>

            <span>
              {numberFormatter.format(experience)}
              {" / "}
              {numberFormatter.format(experienceRequired)} XP
            </span>
          </div>

          <div
            className="xp-bar"
            role="progressbar"
            aria-label={"Experience progress"}
            aria-valuemin={0}
            aria-valuemax={experienceRequired}
            aria-valuenow={experience}
          >
            <div className="xp-fill" style={{ width: `${experiencePercentage}%` }} />
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-section">Kingdom</div>

        <NavItem href="/" label="Throne room" onNavigate={onNavigate} />

        <NavItem href="/routines" label="My routines" onNavigate={onNavigate} />

        <div className="nav-section">Progress</div>

        <NavItem href="/stats" label="Stats" onNavigate={onNavigate} />

        <form action={logoutUserAction}>
          <button type="submit" className="nav-item w-full">
            Logout
          </button>
        </form>
      </nav>
    </aside>
  );
}
