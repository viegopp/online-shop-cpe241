import React, { useState, useRef } from "react";
import { Edit, Camera, Save } from "lucide-react";

const AdminProfile = ({ adminData: initialData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(
    initialData || {
      adminId: "000001",
      userId: "000001",
      firstName: "Nawapol",
      lastName: "Tanprasert",
      email: "mooham.c@onlineshop.com",
      phone: "+66 98 765 4321",
      role: "Super Admin",
      profileImage: "https://i.pravatar.cc/300", // Default image path
    }
  );
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const fileInputRef = useRef(null);

  const toggleEditMode = () => {
    if (isEditing) {
      if (onSave) {
        onSave(adminData);
      } else {
        console.log("Saving profile changes:", adminData);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    if (isEditing && isHoveringImage) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdminData((prev) => ({
          ...prev,
          profileImage: event.target.result,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Full name display
  const fullName = `${adminData.firstName} ${adminData.lastName}`;

  return (
    <div className="max-w-[912px] w-full mx-auto bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg font-bold font-satoshi text-slate-900">
          Personal Information
        </h1>
        <button
          onClick={toggleEditMode}
          className="flex items-center gap-1 px-1.5 py-1 text-xs text-slate-500 border border-slate-200 rounded hover:bg-slate-50"
        >
          {isEditing ? (
            <Save size={13} className="text-slate-500" />
          ) : (
            <Edit size={13} className="text-slate-500" />
          )}
          <span>{isEditing ? "Save profile" : "Edit profile"}</span>
        </button>
      </div>

      <div className="flex items-center mb-5">
        <div
          className="relative w-24 h-24 mr-5"
          onMouseEnter={() => setIsHoveringImage(true)}
          onMouseLeave={() => setIsHoveringImage(false)}
          onClick={handleImageClick}
        >
          <div className="w-full h-full rounded-full overflow-hidden border border-white border-opacity-50">
            <img
              src={adminData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isHoveringImage && isEditing && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200">
              <Camera size={24} className="text-white" />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold font-satoshi">{fullName}</h2>
          <span className="inline-block px-3 py-0.5 text-xs text-green-600 bg-green-50 rounded-md mt-1 font-satoshi">
            {adminData.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Admin ID Field - Locked */}
        <div>
          <label className="block text-xs font-satoshi text-slate-900 mb-1">
            Admin ID
          </label>
          <div className="w-full px-2 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded h-[30px] flex items-center font-satoshi">
            {adminData.adminId}
          </div>
        </div>

        {/* User ID Field - Locked */}
        <div>
          <label className="block text-xs font-satoshi text-slate-900 mb-1">
            User ID
          </label>
          <div className="w-full px-2 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded h-[30px] flex items-center font-satoshi">
            {adminData.userId}
          </div>
        </div>

        {/* First Name Field */}
        <div>
          <label className="block text-xs font-satoshi text-slate-900 mb-1">
            First Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={adminData.firstName}
              name="firstName"
              onChange={handleInputChange}
              className="w-full px-2 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-300 h-[30px] font-satoshi"
            />
          ) : (
            <div className="w-full px-2 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded h-[30px] flex items-center font-satoshi">
              {adminData.firstName}
            </div>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <label className="block text-xs font-satoshi text-slate-900 mb-1">
            Last Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={adminData.lastName}
              name="lastName"
              onChange={handleInputChange}
              className="w-full px-2 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-300 h-[30px] font-satoshi"
            />
          ) : (
            <div className="w-full px-2 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded h-[30px] flex items-center font-satoshi">
              {adminData.lastName}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-satoshi text-slate-900 mb-1">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={adminData.email}
              name="email"
              onChange={handleInputChange}
              className="w-full px-2 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-300 h-[30px] font-satoshi"
            />
          ) : (
            <div className="w-full px-2 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded h-[30px] flex items-center font-satoshi">
              {adminData.email}
            </div>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-xs font-satoshi text-slate-900 mb-1">
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="text"
              value={adminData.phone}
              name="phone"
              onChange={handleInputChange}
              className="w-full px-2 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded focus:outline-none focus:border-slate-300 h-[30px] font-satoshi"
            />
          ) : (
            <div className="w-full px-2 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded h-[30px] flex items-center font-satoshi">
              {adminData.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

/*
Example Usage:
<AdminProfile
  adminData={{
    adminId: "000001",
    userId: "000001",
    firstName: "Nawapol",
    lastName: "Tanprasert",
    email: "mooham.c@onlineshop.com",
    phone: "+66 98 765 4321",
    role: "Super Admin",
    profileImage: "https://i.pravatar.cc/300"
  }}
  onSave={(updatedData) => console.log("Profile updated:", updatedData)}
/>
*/
