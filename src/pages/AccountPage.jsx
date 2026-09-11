import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import useNotification from "@/hooks/useNotification";
import useAuthMutations from "@/hooks/queries/useAuthQueries";
import { splitPhone, userInitials } from "@/utils/formatters";
import { getRoleLabel } from "@/utils/roles";

export const AccountPage = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { updateProfileMutation } = useAuthMutations();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Calculate initial values from user object for change detection
  const initialValues = useMemo(() => {
    if (!user) return { firstName: "", lastName: "", countryCode: "+91", phoneNumber: "" };
    const parts = String(user.name || "").trim().split(/\s+/).filter(Boolean);
    const phoneParts = splitPhone(user.phone);
    const cleanedInitialPhone = (phoneParts.number || "").replace(/\D/g, "").slice(0, 10);
    return {
      firstName: (parts[0] || "").slice(0, 20),
      lastName: (parts.slice(1).join(" ") || "").slice(0, 20),
      countryCode: phoneParts.countryCode || "+91",
      phoneNumber: cleanedInitialPhone,
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      setFirstName(initialValues.firstName);
      setLastName(initialValues.lastName);
      setCountryCode(initialValues.countryCode);
      setPhoneNumber(initialValues.phoneNumber);
    }
  }, [user, initialValues]);

  // Handle first name with 20 char limit
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value.slice(0, 20));
  };

  // Handle last name with 20 char limit
  const handleLastNameChange = (e) => {
    setLastName(e.target.value.slice(0, 20));
  };

  // Handle phone number input to restrict to digits and max 10 digits
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(digitsOnly);
  };

  // Check if any form value has changed from initial state
  const isDirty = useMemo(() => {
    return (
      firstName.trim() !== initialValues.firstName.trim() ||
      lastName.trim() !== initialValues.lastName.trim() ||
      phoneNumber.trim() !== initialValues.phoneNumber.trim()
    );
  }, [firstName, lastName, phoneNumber, initialValues]);

  // Validation: First Name required (max 20 chars), and if Phone is provided it must be 10 digits
  const isPhoneValid = !phoneNumber || phoneNumber.length === 10;
  const isFormValid = firstName.trim().length > 0 && isPhoneValid;
  const isSaveDisabled = !isDirty || !isFormValid || updateProfileMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneNumber && phoneNumber.length !== 10) {
      showError("Phone number must be exactly 10 digits.");
      return;
    }

    const fullName = [firstName.trim().slice(0, 20), lastName.trim().slice(0, 20)]
      .filter(Boolean)
      .join(" ")
      .trim();
    const fullPhone = phoneNumber ? `${countryCode} ${phoneNumber}`.trim() : "";

    try {
      const res = await updateProfileMutation.mutateAsync({
        name: fullName,
        phone: fullPhone,
      });

      const updatedUser =
        res?.user || res?.current_user || res?.data?.user || res?.data;

      if (updatedUser) {
        setUser({ ...user, ...updatedUser });
      } else {
        setUser({ ...user, name: fullName, phone: fullPhone });
      }

      showSuccess(
        res?.message ||
          t("account.updatedSuccess", {
            defaultValue: "Profile updated successfully",
          })
      );
    } catch (err) {
      showError(err.message || "Unable to update profile.");
    }
  };

  const isSubmitting = updateProfileMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5 py-4">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t("account.pageTitle", { defaultValue: "Account Management" })}
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t("account.pageSubtitle", { defaultValue: "Manage your profile information" })}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
        {/* Avatar Profile Section */}
        <div className="flex flex-col items-center pb-6 border-b border-slate-100 mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-white shadow-md text-[#059669] font-black text-2xl grid place-items-center mb-3">
            {userInitials(user?.name)}
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {user?.name || "User"}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">
            {user?.email || "email@agent.com"}
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200 text-xs font-bold capitalize">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>{getRoleLabel(user?.role)}</span>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {t("account.firstName", { defaultValue: "First Name" })} *
              </label>
              {firstName.length > 0 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  {firstName.length}/20
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={20}
              value={firstName}
              onChange={handleFirstNameChange}
              placeholder="First name"
              className="h-10 px-3.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#10b981]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {t("account.lastName", { defaultValue: "Last Name" })}
              </label>
              {lastName.length > 0 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  {lastName.length}/20
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={20}
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Last name"
              className="h-10 px-3.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#10b981]"
            />
          </div>

          <div className="col-span-full flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              {t("account.email", { defaultValue: "Email" })}
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="h-10 px-3.5 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">
              {t("account.countryCode", { defaultValue: "Country Code" })}
            </label>
            <input
              type="text"
              disabled
              value={countryCode}
              className="h-10 px-3.5 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {t("account.phoneNumber", { defaultValue: "Phone Number" })}
              </label>
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <span className="text-[10px] text-amber-600 font-bold">
                  {phoneNumber.length}/10 digits
                </span>
              )}
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder={t("account.phoneNumberPlaceholder", { defaultValue: "9876543210" })}
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`h-10 px-3.5 border rounded-lg text-xs font-semibold text-slate-800 outline-none transition-colors ${
                phoneNumber.length > 0 && phoneNumber.length < 10
                  ? "border-amber-400 focus:border-amber-500"
                  : "border-slate-300 focus:border-[#10b981]"
              }`}
            />
          </div>

          <div className="col-span-full flex justify-end mt-4 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSaveDisabled}
              className="px-6 py-2.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md shadow-[#10b981]/25 transition-all cursor-pointer"
            >
              {isSubmitting
                ? t("common.submitting", { defaultValue: "Saving..." })
                : t("account.saveChanges", { defaultValue: "Save Changes" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
