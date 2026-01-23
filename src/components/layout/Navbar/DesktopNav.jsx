import { NavLink } from "react-router-dom";

export default function DesktopNav({ navItems, navLinkStyles, t }) {
    return (
        <div className="hidden min-[761px]:flex items-center gap-8">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => navLinkStyles({ isActive }).className}
                    style={({ isActive }) => navLinkStyles({ isActive }).style}
                >
                    {t ? t(item.translationKey) : item.name}
                </NavLink>
            ))}
        </div>
    );
}
