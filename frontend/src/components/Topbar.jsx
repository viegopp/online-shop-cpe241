const Topbar = () => {
    return (
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <button className="border p-2 rounded-lg hover:bg-gray-100">
          <img src="/mock-icons/collapse.png" alt="collapse sidebar" className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">Mooham Chugra</p>
            <p className="text-sm text-gray-500">Staff Admin</p>
          </div>
          <img src="/mock-icons/avatar.png" alt="avatar" className="w-10 h-10 rounded-full" />
          <img src="/mock-icons/dropdown.png" alt="dropdown" className="w-4 h-4" />
        </div>
      </header>
    );
  };
  
  export default Topbar;