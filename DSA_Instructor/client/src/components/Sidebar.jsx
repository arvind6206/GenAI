import React from "react";
import {
  Bot,
  CodeXml,
  NotebookText,
  RotateCcwClock,
  Settings,
  House,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: House,
    },
    {
      name: "History",
      icon: RotateCcwClock,
    },
    {
      name: "Tutorials",
      icon: NotebookText,
    },
    {
      name: "Playground",
      icon: CodeXml,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="bg-[#0E1626] min-h-screen w-60 shrink-0">
      {/* Logo */}
      <div className="h-20 px-5 flex items-center gap-3 border-b border-slate-700">
        <div className="bg-[#6A66F2] p-2 rounded-lg">
          <Bot size={28} className="text-white" />
        </div>

        <h1 className="text-xl font-bold text-[#49A3F2]">Code Mentor AI</h1>
      </div>

      <nav className="px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                mb-2
                text-slate-300
                font-medium
                rounded-lg
                cursor-pointer
                hover:bg-[#6A66F2]
                hover:text-white
                transition-colors
                duration-200
              "
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
