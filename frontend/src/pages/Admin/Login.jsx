import LoginForm from "../../components/forms/LoginForm";

const LoginAdmin = () => {
  return (
    <main className="flex overflow-hidden flex-col items-center px-20 pt-36 pb-72 bg-white max-md:px-5 max-md:py-24">
      <div className="flex flex-col items-center max-w-full w-[405px]">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="OnlineShop Logo" className="w-12 h-22" />
          <div className="relative h-18 flex flex-col justify-center items-center">
            <div className="bg-slate-500 text-white font-normal text-sm text-center w-14 rounded-sm absolute right-0 top-0">
              <p>studio</p>
            </div>
            <h1 className="text-6xl font-bold leading-none text-slate-900 max-md:text-4xl">
              OnlineShop
            </h1>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginAdmin;
