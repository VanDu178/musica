import React, { useState, useEffect } from "react";
import AdminSidebar from '../../components/Admin/SideBar/SideBar';
import './AdminLayout.css';
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";
import { checkData } from "../../helpers/encryptionHelper";
import Loading from "../../components/Loading/Loading";
import { useTranslation } from "react-i18next";

const AdminLayout = ({ children }) => {
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);
    const [IsCheckingRole, setIsCheckingRole] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRole = async () => {
            setIsCheckingRole(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải admin không nếu đúng thì không cho hiển thị
                const checkedRoleAdmin = await checkData(1);
                if (checkedRoleAdmin) {
                    setValidRole(true);
                    setIsCheckingRole(false);
                }
            }
            setIsCheckingRole(false);
        };

        fetchRole();
    }, [isLoggedIn]);

    if (IsCheckingRole) {
        return <Loading message={t("utils.loading")} height="110" />;
    }

    if (!validRole) {
        return <Forbidden />;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
