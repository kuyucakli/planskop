import { NavMain } from "./navs/NavMain";

const MainNavBar = async () => {
  return (
    <div className="main-nav-bar py-0 md:py-6 bg-zinc-900 md:bg-linear-to-b from-zinc-600 via-stone-800 to-zinc-900 z-50">
      <NavMain />
    </div>
  );
};

export default MainNavBar;
