// import { useState } from "react";
// import { Eye, EyeOff, Save } from "lucide-react";
// import Tabs from "../components/ui/Tabs";
// import Swal from "sweetalert2";
// import { changePassword } from "../services/authService";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const Settings = () => {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSave = async () => {
//     if (!oldPassword || !newPassword || !confirmNewPassword) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing Fields",
//         text: "Please fill in all password fields.",
//       });
//       return;
//     }

//     if (newPassword.length < 6) {
//       Swal.fire({
//         icon: "warning",
//         title: "Weak Password",
//         text: "New password must be at least 6 characters long.",
//       });
//       return;
//     }

//     if (newPassword !== confirmNewPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Password Mismatch",
//         text: "New password and confirmation do not match.",
//       });
//       return;
//     }

//     try {
//       await changePassword(oldPassword, newPassword);

//       Swal.fire({
//         icon: "success",
//         title: "Password Changed",
//         text: "Your password has been successfully updated. Logging you out...",
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       setTimeout(() => {
//         Cookies.remove("accessToken");
//         navigate("/login");
//       }, 2000);
//     } catch (error: any) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed to Change Password",
//         text:
//           error?.response?.data?.message ||
//           "An error occurred while changing the password.",
//       });
//     }
//   };

//   // General settings content
//   const generalSettings = (
//     <div className="space-y-4">
//       <div>
//         <label
//           htmlFor="siteName"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Site Name
//         </label>
//         <input
//           type="text"
//           id="siteName"
//           className="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed text-gray-500"
//           defaultValue="My Foreign Job"
//           readOnly
//           disabled
//         />
//       </div>

//       <div>
//         <label
//           htmlFor="siteDescription"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Site Description
//         </label>
//         <textarea
//           id="siteDescription"
//           rows={3}
//           className="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed text-gray-500"
//           defaultValue="AI-powered admin dashboard for managing your application."
//           readOnly
//           disabled
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Timezone
//         </label>
//         <select
//           className="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed text-gray-500"
//           disabled
//         >
//           <option>UTC (GMT+0)</option>
//           <option>Eastern Time (GMT-5)</option>
//           <option>Pacific Time (GMT-8)</option>
//           <option>Central European Time (GMT+1)</option>
//           <option>Japan Standard Time (GMT+9)</option>
//         </select>
//       </div>
//     </div>
//   );

//    const securitySettings = (
//     <div className="space-y-4">
//       <div>
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Old Password
//         </label>
//         <div className="relative w-full sm:w-1/2">
//           <input
//             type={showOldPassword ? "text" : "password"}
//             id="password"
//             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Old password"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//           />
//           <span
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//             onClick={() => setShowOldPassword(!showOldPassword)}
//           >
//             {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </span>
//         </div>
//       </div>

//       {/* New Password */}
//       <div>
//         <label
//           htmlFor="newPassword"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           New Password
//         </label>
//         <div className="relative w-full sm:w-1/2">
//           <input
//             type={showNewPassword ? "text" : "password"}
//             id="newPassword"
//             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Enter new password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//           <span
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//             onClick={() => setShowNewPassword(!showNewPassword)}
//           >
//             {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </span>
//         </div>
//       </div>

//       {/* Confirm New Password */}
//       <div>
//         <label
//           htmlFor="confirmNewPassword"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Confirm New Password
//         </label>
//         <div className="relative w-full sm:w-1/2">
//           <input
//             type={showConfirmNewPassword ? "text" : "password"}
//             id="confirmNewPassword"
//             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Confirm new password"
//             value={confirmNewPassword}
//             onChange={(e) => setConfirmNewPassword(e.target.value)}
//           />
//           <span
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//             onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
//           >
//             {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </span>
//         </div>
//       </div>
//     </div>
//   );

//   const tabs = [
//     {
//       id: "general",
//       label: "General",
//       content: generalSettings,
//     },
//     {
//       id: "security",
//       label: "Security",
//       content: securitySettings,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//       </div>

//       <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
//         <div className="p-6">
//           <Tabs tabs={tabs} defaultTab="general" />

//           <div className="pt-5 mt-6">
//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 className="bg-white py-2 px-4 border border-gray-300 cursor-pointer rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 className="ml-3 inline-flex justify-center cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <Save size={16} className="mr-2" />
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;


import { useState, useEffect } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import Tabs from "../components/ui/Tabs";
import Swal from "sweetalert2";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // General settings
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/api/settings");
        setSiteName(data.siteName);
        setSiteDescription(data.siteDescription);
        setTimezone(data.timezone);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Swal.fire("Warning", "All password fields are required", "warning");
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire("Warning", "New password must be at least 6 characters", "warning");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire("Error", "New password and confirmation do not match", "error");
      return;
    }

    try {
      await api.post("/api/auth/change-password", { oldPassword, newPassword });
      Swal.fire("Success", "Password changed. Please login again.", "success");
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to change password", "error");
    }
  };

  const handleGeneralUpdate = async () => {
    try {
      await api.put("/api/settings", { siteName, siteDescription, timezone });
      Swal.fire("Success", "Settings updated", "success");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  const handleSave = async () => {
    // Detect active tab by checking which panel is visible
    const activeTab = document.querySelector('[role="tabpanel"]:not([hidden])')?.id;
    if (activeTab?.includes("security")) {
      await handlePasswordChange();
    } else {
      await handleGeneralUpdate();
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    // Reload general settings
    api.get("/api/settings").then(({ data }) => {
      setSiteName(data.siteName);
      setSiteDescription(data.siteDescription);
      setTimezone(data.timezone);
    });
  };

  if (loading) return <div className="text-center p-8">Loading settings...</div>;

  const generalSettings = (
    <div className="space-y-4">
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
          Site Name
        </label>
        <input
          type="text"
          id="siteName"
          className="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Site Description
        </label>
        <textarea
          id="siteDescription"
          rows={3}
          className="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select
          className="block w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option value="UTC">UTC (GMT+0)</option>
          <option value="America/New_York">Eastern Time (GMT-5)</option>
          <option value="America/Los_Angeles">Pacific Time (GMT-8)</option>
          <option value="Europe/Berlin">Central European Time (GMT+1)</option>
          <option value="Asia/Tokyo">Japan Standard Time (GMT+9)</option>
        </select>
      </div>
    </div>
  );

  const securitySettings = (
    <div className="space-y-4">
      <div>
        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Old Password
        </label>
        <div className="relative w-full sm:w-1/2">
          <input
            type={showOldPassword ? "text" : "password"}
            id="oldPassword"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowOldPassword(!showOldPassword)}>
            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative w-full sm:w-1/2">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowNewPassword(!showNewPassword)}>
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <div className="relative w-full sm:w-1/2">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            id="confirmNewPassword"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
            {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "general", label: "General", content: generalSettings },
    { id: "security", label: "Security", content: securitySettings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <Tabs tabs={tabs} defaultTab="general" />
          <div className="pt-5 mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;