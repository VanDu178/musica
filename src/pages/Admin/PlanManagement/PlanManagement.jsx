import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../config/axiosConfig";
import { handleError, handleSuccess } from "../../../helpers/toast";
import { useUserData } from "../../../context/UserDataProvider";
import { checkData } from "../../../helpers/encryptionHelper";
import Loading from "../../../components/Loading/Loading";
import Forbidden from "../../../components/Error/403/403";
import { ClipLoader } from "react-spinners"
import "./PlanManagement.css";

const PlanManagement = () => {
    const { t } = useTranslation();
    const [premiumPlans, setPremiumPlan] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [validRole, setValidRole] = useState(false);
    const { isLoggedIn } = useUserData();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration_days: ""
    });

    const [editingPlanId, setEditingPlanId] = useState(null);




    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true);
            if (isLoggedIn) {
                const checkedRoleAdmin = await checkData(1); // 3 là role admin?
                if (checkedRoleAdmin) {
                    setValidRole(true);
                }
            }
            setIsLoading(false);
        };
        fetchRole();
    }, [isLoggedIn]);

    useEffect(() => {
        fetchPlans(page);
    }, [page]);

    useEffect(() => {
        if (premiumPlans.length === 0 && page > 1) {
            setPage((prev) => prev - 1);
        }
    }, [premiumPlans, page]);


    const fetchPlans = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`/admin/plans/?page=${page}&page_size=${pageSize}/`);
            if (response?.status === 200) {
                console.log("daa", response);
                setPremiumPlan(response?.data?.results);
                setPage(page);
                setTotalPages(Math.ceil(response?.data?.count / pageSize));
            }
        } catch (error) {
            console.log(error)
            handleError(t("admin.plan_management.fetch_error"));
            setPremiumPlan([]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFormData({ name: "", price: "", duration_days: "" });
        setEditingPlanId(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsProcessing(true)
            if (editingPlanId) {
                // Edit
                const response = await axiosInstance.put(`/admin/plans/${editingPlanId}/`, formData);
                if (response?.status === 200) {
                    handleSuccess(t("admin.plan_management.update_success"));
                    fetchPlans();
                    setEditingPlanId(null);
                    setFormData({ name: "", price: "", duration_days: "" });
                }
            } else {
                // Create
                const response = await axiosInstance.post("/admin/plans/", formData);
                if (response?.status === 201) {
                    handleSuccess(t("admin.plan_management.create_success"));
                    fetchPlans();
                    setFormData({ name: "", price: "", duration_days: "" });
                }
            }
        } catch (error) {
            handleError(t("admin.plan_management.submit_error"));
        }
        finally {
            setIsProcessing(false)
        }
    };

    const handleEdit = (plan) => {
        setEditingPlanId(plan.id);
        setFormData({
            name: plan.name,
            price: plan.price,
            duration_days: plan.duration_days
        });
    };

    const handleDelete = async (id) => {
        try {
            setIsProcessing(true)
            const response = await axiosInstance.delete(`/admin/plans/${id}/`);
            if (response?.status === 204) {
                handleSuccess(t("admin.plan_management.delete_success"));
                fetchPlans();
            }
        } catch (error) {
            if (error?.status === 400) {
                handleError(t("admin.plan_management.exited_premiumsubscription_set"));
            }
            else {
                handleError(t("admin.plan_management.delete_error"));
            }
        }
        finally {
            setIsProcessing(false)
        }
    };

    if (isLoading) {
        return <Loading message={t("utils.loading")} height="60" />;
    }

    if (!validRole) {
        return <Forbidden />;
    }

    return (
        <div className="plan-management-container">
            <h2>{t("admin.plan_management.title")}</h2>

            {/* Form */}
            <form className="plan-form" >
                <input
                    type="text"
                    name="name"
                    placeholder={t("admin.plan_management.name")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder={t("admin.plan_management.price")}
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="duration_days"
                    placeholder={t("admin.plan_management.duration_day")}
                    value={formData.duration_days}
                    onChange={handleChange}
                    required
                />
                <button className="btnSubmit" onClick={handleSubmit} disabled={isLoading || isProcessing}>
                    {isProcessing ? (
                        <>
                            <ClipLoader color="#fff" size={16} />
                            <span className="ml-2">{t("admin.plan_management.processing_btn")}</span>
                        </>
                    ) : editingPlanId ? (
                        t("admin.plan_management.update_btn")
                    ) : (
                        t("admin.plan_management.create_btn")
                    )}
                </button>
                <button className="btnReset" onClick={handleReset} disabled={isLoading || isProcessing}>
                    Reset
                </button>
            </form>

            {/* Table */}
            <table className="plan-table">
                <thead>
                    <tr>
                        <th>{t("admin.plan_management.name")}</th>
                        <th>{t("admin.plan_management.price")}</th>
                        <th>{t("admin.plan_management.duration_day")}</th>
                        <th>{t("admin.plan_management.actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {premiumPlans?.map((plan) => (
                        <tr key={plan.id}>
                            <td>{plan.name}</td>
                            <td>{plan.price}</td>
                            <td>{plan.duration_days}</td>
                            <td>
                                <button onClick={() => handleEdit(plan)}>
                                    {t("admin.plan_management.edit_btn")}
                                </button>
                                <button onClick={() => handleDelete(plan.id)}>
                                    {t("admin.plan_management.delete_btn")}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {premiumPlans.length > 0 && (
                    <div className="plan-management-pagination ">
                        <button
                            onClick={() => fetchPlans(page - 1)}
                            disabled={page === 1 || isLoading || isProcessing}
                        >
                            {t("admin.plan_management.btnBack")}
                        </button>
                        <span>
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => fetchPlans(page + 1)}
                            disabled={page === totalPages || isLoading || isProcessing}
                        >
                            {t("admin.plan_management.btnNext")}
                        </button>
                    </div>
                )}
            </table>
        </div>
    );
};

export default PlanManagement;
