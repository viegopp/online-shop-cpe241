import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center text-gray-300 text-4xl font-semibold">
          <p>OnlineShop</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;