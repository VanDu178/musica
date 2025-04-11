import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../config/axiosConfig";
import { handleError, handleSuccess } from "../../../helpers/toast";
import { useUserData } from "../../../context/UserDataProvider";
import { checkData } from "../../../helpers/encryptionHelper";
import Loading from "../../../components/Loading/Loading";
import Forbidden from "../../../components/Error/403/403";
import "./AccountManagement.css";

const AccountManagement = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingUserId, setProcessingUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validRole, setValidRole] = useState(false);
  const { isLoggedIn } = useUserData();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      if (isLoggedIn) {
        //nếu đang login thì check role phải user không
        const checkedRoleUser = await checkData(1);
        if (checkedRoleUser) {
          setValidRole(true);
          setIsLoading(false);
        }
      } else {
        //nếu không login thì hiển thị
        setValidRole(false);
        setIsLoading(false);
      }
      setIsLoading(false);
    };

    fetchRole();
  }, [isLoggedIn]);

  useEffect(() => {
    getAccounts(page);
  }, [page]);

  //Cách phân trang hiện tại của mình đang dùng là PageNumberPagination.
  //Cách này có vấn đề là nếu người dùng di chuyển đến trang cuối và xóa hết dữ liệu trang đó thì
  //giao diện sẽ hiển thị dữ liệu rỗng, vì request xuống backend, page hiện tại vẫn là page đã bị xóa hết dữ liệu
  //chính vì thế cần check nếu dữ liệu là rỗng và page vẫn đang lớn hơn 1 thì ta quay về page trước đó để request.
  //Vì trong trang này không có chức nnawg xóa nên không cần check
  // useEffect(() => {
  //   if (accounts.length === 0 && page > 1) {
  //     setPage((prev) => prev - 1);
  //   }
  // }, [accounts, page]);

  const getAccounts = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/admin/accounts/${page}/`);
      if (response?.status === 200) {
        console.log(response);
        setAccounts(response?.data?.results);
        setPage(page);
        setTotalPages(Math.ceil(response.data.count / 3));
      }
    } catch (error) {
      handleError(t("admin.account_management.error_fetching_users"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBanUser = async (userId) => {
    try {
      setProcessingUserId(userId);
      setIsProcessing(true); // Show spinner when starting ban
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
      setIsProcessing(false); // Hide spinner after finishing
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      setProcessingUserId(userId);
      setIsProcessing(true); // Show spinner when starting unban
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
      setIsProcessing(false); // Hide spinner after finishing
    }
  };

  const filteredUsers = accounts?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading message={t("utils.loading")} height="60" />;
  }

  if (!validRole) {
    return <Forbidden />;
  }

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
      {/* {isLoading ? (
        <div className="account_management-loading-container">
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />{" "}
          <p>{t("admin.account_management.loading")}</p>
        </div>
      ) :  */}
      {filteredUsers.length === 0 ? (
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
                      disabled={isProcessing || processingUserId === user.id} // Disable button during processing
                    >
                      {processingUserId === user.id
                        ? t("admin.account_management.unbanning")
                        : t("admin.account_management.unban_account")}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBanUser(user.id)}
                      className="account_management-ban-btn"
                      disabled={isProcessing || processingUserId === user.id} // Disable button during processing
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
          {accounts.length > 0 && (
            <div className="account_management-pagination">
              <button
                onClick={() => getAccounts(page - 1)}
                disabled={page === 1 || isLoading}
              >
                {t("admin.account_management.btnBack")}
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => getAccounts(page + 1)}
                disabled={page === totalPages || isLoading}
              >
                {t("admin.account_management.btnNext")}
              </button>
            </div>
          )}
        </table>
      )}
    </div>
  );
};

export default AccountManagement;
