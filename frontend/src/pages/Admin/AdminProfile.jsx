import MainLayout from "../../components/layouts/MainLayout";
import AdminProfile from "../../components/forms/ProfileManage";
import { useParams } from "react-router-dom";

const AdminProfilePage = () => {
  const { productId } = useParams();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admins", href: "admin/user/admins" },
    { label: productId, href: `admin/user/admins/${productId}` },
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbItems} title="Admins Manager">
      <div className="flex items-center flex-col w-full h-full min-h-[400px]">
        <AdminProfile />
      </div>
    </MainLayout>
  );
};

export default AdminProfilePage;
