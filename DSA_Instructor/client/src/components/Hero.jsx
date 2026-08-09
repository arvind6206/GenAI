import {
  GitBranch,
  Languages,
  Flame,
  ChevronRight,
} from "lucide-react";

function Hero() {
  const topics = [
    "JavaScript Closures",
    "Python Decorators",
    "React Hooks",
    "Recursion Patterns",
    "Async/Await",
  ];

  return (
    <div className="bg-[#101A26] w-full px-4 pt-4 pb-3">

      {/* Two Main Cards */}
      <div className="flex gap-5">

        {/* ================= LEFT CARD ================= */}
        <div className="bg-[#202E40] w-1/2 h-[215px] rounded-xl border border-slate-700 p-5">

          <div className="flex items-center justify-center gap-4 h-full">

            {/* Questions Solved */}
            <div className="flex-1 h-[120px] border border-slate-700 rounded-lg flex flex-col items-center justify-center">

              <GitBranch
                size={27}
                className="text-violet-500 mb-2"
              />

              <p className="text-blue-400 text-3xl font-bold">
                1,248
              </p>

              <span className="text-slate-400 text-xs mt-1">
                Questions Solved
              </span>

            </div>

            {/* Languages */}
            <div className="flex-1 h-[120px] border border-slate-700 rounded-lg flex flex-col items-center justify-center">

              <Languages
                size={27}
                className="text-cyan-400 mb-2"
              />

              <p className="text-blue-400 text-3xl font-bold">
                24
              </p>

              <span className="text-slate-400 text-xs mt-1">
                Languages
              </span>

            </div>

          </div>
        </div>


        {/* ================= RIGHT CARD ================= */}
        <div className="bg-[#202E40] w-1/2 h-[215px] rounded-xl border border-slate-700">

          {/* Heading */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700">

            <Flame
              size={20}
              className="text-orange-400"
            />

            <h2 className="text-white font-semibold">
              Popular Topics
            </h2>

          </div>

          {/* Topics */}
          <div className="px-4 py-3">

            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center gap-2 py-1"
              >

                <ChevronRight
                  size={17}
                  className="text-violet-400"
                />

                <p className="text-slate-200 text-sm">
                  {topic}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Hero;