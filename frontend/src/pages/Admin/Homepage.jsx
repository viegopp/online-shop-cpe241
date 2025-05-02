import MainLayout from "../../components/layouts/MainLayout";

const Homepage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    // { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems}>
      <div className="flex justify-center items-center flex-col w-full h-full min-h-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 px-4 py-8 opacity-20">
          <img src="/logo.svg" alt="OnlineShop Logo" className="w-20 h-20" />
          <h1 className="text-6xl font-bold leading-none text-slate-900 max-md:text-4xl">
            OnlineShop
          </h1>
        </div>
      </div>
    </MainLayout>
  );
};

export default Homepage;
