import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../config/axiosConfig";
import { handleError, handleSuccess } from "../../../helpers/toast";
import { ClipLoader } from "react-spinners"; // Import Spinner
import "./AccountManagement.css";

const AccountManagement = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading spinner state
  const [processingUserId, setProcessingUserId] = useState(null);

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    try {
      setIsLoading(true); // Show spinner when starting API call
      const response = await axiosInstance.get("/admin/accounts/");
      if (response?.status === 200) {
        setAccounts(response?.data);
      }
    } catch (error) {
      handleError(t("admin.account_management.error_fetching_users"));
    } finally {
      setIsLoading(false); // Hide spinner after finishing API call
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBanUser = async (userId) => {
    try {
      setProcessingUserId(userId);
      setIsLoading(true); // Show spinner when starting ban
      const response = await axiosInstance.post(
        `/admin/accounts/ban-account/${userId}/`
      );
      if (response?.status === 200) {
        setAccounts((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, is_ban: true } : user
          )
        );
        handleSuccess(t("admin.account_management.ban_success"));
      }
    } catch (error) {
      handleError(t("admin.account_management.ban_error"));
    } finally {
      setProcessingUserId(null);
      setIsLoading(false); // Hide spinner after finishing
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      setProcessingUserId(userId);
      setIsLoading(true); // Show spinner when starting unban
      const response = await axiosInstance.post(
        `/admin/accounts/unban-account/${userId}/`
      );
      if (response?.status === 200) {
        setAccounts((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, is_ban: false } : user
          )
        );
        handleSuccess(t("admin.account_management.unban_success"));
      }
    } catch (error) {
      handleError(t("admin.account_management.unban_error"));
    } finally {
      setProcessingUserId(null);
      setIsLoading(false); // Hide spinner after finishing
    }
  };

  const filteredUsers = accounts?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="account_management-user-management-container">
      <h2>{t("admin.account_management.title")}</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={t("admin.account_management.search_placeholder")}
        value={searchTerm}
        onChange={handleSearch}
        className="account_management-user-search-bar"
      />

      {isLoading ? (
        <div className="account_management-loading-container">
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />{" "}
          {/* Display spinner */}
          <p>{t("admin.account_management.loading")}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <p>{t("admin.account_management.no_results")}</p>
      ) : (
        <table className="account_management-user-table">
          <thead>
            <tr>
              <th>{t("admin.account_management.email")}</th>
              <th>{t("admin.account_management.name")}</th>
              <th>{t("admin.account_management.role")}</th>
              <th>{t("admin.account_management.status")}</th>
              <th>{t("admin.account_management.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name || t("admin.account_management.no_name")}</td>
                <td>
                  {user.role?.name ||
                    t("admin.account_management.role_unknown")}
                </td>
                <td>
                  {user.is_ban
                    ? t("admin.account_management.status_banned")
                    : t("admin.account_management.status_active")}
                </td>
                <td>
                  {user.is_ban ? (
                    <button
                      onClick={() => handleUnbanUser(user.id)}
                      className="account_management-unban-btn"
                      disabled={isLoading || processingUserId === user.id} // Disable button during processing
                    >
                      {processingUserId === user.id
                        ? t("admin.account_management.unbanning")
                        : t("admin.account_management.unban_account")}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBanUser(user.id)}
                      className="account_management-ban-btn"
                      disabled={isLoading || processingUserId === user.id} // Disable button during processing
                    >
                      {processingUserId === user.id
                        ? t("admin.account_management.banning")
                        : t("admin.account_management.ban_account")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountManagement;
