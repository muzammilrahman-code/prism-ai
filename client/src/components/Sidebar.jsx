import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House, premium: false },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen, premium: false },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash, premium: false },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image, premium: true },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser, premium: true },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors, premium: true },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText, premium: true },
  { to: "/ai/document-converter", label: "Document Converter", Icon: FileText, premium: false },
  { to: "/ai/community", label: "Community", Icon: Users, premium: false },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out z-10`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center">{user.fullName}</h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon, premium }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded justify-between group ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                    : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                    {label}
                  </div>
                  {premium && (
                    <span className="text-xs bg-gradient-to-r from-[#FF61C5] to-[#9E53EE] text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                      Pro
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="w-8 rounded-full"
          />
          <div>
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>{" "}
              Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
