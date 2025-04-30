import SignUpForm from "../../components/SignUpForm";

const SignUpCustomer = () => {
  return (
    <main className="flex overflow-hidden flex-col items-center px-20 pt-24 pb-72 bg-white max-md:px-5 max-md:py-24">
      <div className="flex flex-col items-center max-w-full w-[405px]">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="OnlineShop Logo" className="w-12 h-12" />
          <h1 className="text-6xl font-bold leading-none text-slate-900 max-md:text-4xl">
            OnlineShop
          </h1>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
};

export default SignUpCustomer;
