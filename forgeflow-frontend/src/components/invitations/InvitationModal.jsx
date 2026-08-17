import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function InvitationModal({
    isOpen,
    onClose,
}) {
    const [inviteType, setInviteType] = useState("new");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // ==========================================
// Existing Member State
// ==========================================

const [projects, setProjects] = useState([]);

const [selectedProject, setSelectedProject] =
    useState("");

const [availableMembers, setAvailableMembers] =
    useState([]);

const [selectedMember, setSelectedMember] =
    useState("");

const [permissionRole, setPermissionRole] =
    useState("member");

const [loadingProjects, setLoadingProjects] =
    useState(false);

const [loadingMembers, setLoadingMembers] =
    useState(false);
    const loadProjects = async () => {

    try {

        setLoadingProjects(true);
        setError("");

        const response =
            await api.get("/projects");

        setProjects(
            response.data.data || []
        );

    } catch (error) {

        console.error(
            "Failed to load projects:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Failed to load projects."
        );

    } finally {

        setLoadingProjects(false);

    }
};
const loadAvailableMembers = async (
    projectId
) => {

    if (!projectId) {

        setAvailableMembers([]);
        setSelectedMember("");

        return;
    }

    try {

        setLoadingMembers(true);
        setError("");
        setSelectedMember("");

        const response =
            await api.get(
                `/projects/${projectId}/members/available`
            );

        console.log(
            "Available members:",
            response.data
        );

        setAvailableMembers(
            response.data.data || []
        );

    } catch (error) {

        console.error(
            "Failed to load available members:",
            error
        );

        setAvailableMembers([]);

        setError(
            error.response?.data?.message ||
            "Failed to load available members."
        );

    } finally {

        setLoadingMembers(false);

    }
};
const handleAddExistingMember =
    async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedProject) {

            setError(
                "Please select a project."
            );

            return;
        }

        if (!selectedMember) {

            setError(
                "Please select a member."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await api.post(
                    `/projects/${selectedProject}/members`,
                    {
                        userId:
                            selectedMember,

                        permission_role:
                            permissionRole,
                    }
                );

            console.log(
                "Member added:",
                response.data
            );

            setSuccess(
                "Member added to the project successfully."
            );

            // Remove the newly-added user from the available list

            setAvailableMembers(
                (prev) =>
                    prev.filter(
                        (member) =>
                            member.id !==
                            selectedMember
                    )
            );

            setSelectedMember("");

            setPermissionRole("member");

        } catch (error) {

            console.error(
                "Add member error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to add member to project."
            );

        } finally {

            setLoading(false);

        }
    };
useEffect(() => {

    if (!isOpen) {
        return;
    }

    loadProjects();

}, [isOpen]);
    if (!isOpen) {
        return null;
    }

    const resetForm = () => {

    setName("");
    setEmail("");
    setPassword("");

    setSelectedProject("");
    setAvailableMembers([]);
    setSelectedMember("");
    setPermissionRole("member");

    setError("");
    setSuccess("");
};

    const handleClose = () => {
        if (loading) return;

        resetForm();
        setInviteType("new");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==========================================
        // Basic validation
        // ==========================================

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);

            // ==========================================
            // New Member Invitation
            // ==========================================

            const response = await api.post(
                "/invitations",
                {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                }
            );

            console.log(
                "Invitation response:",
                response.data
            );

            setSuccess(
                "Invitation sent successfully."
            );

            // Clear form
            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error(
                "Invitation Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to send invitation.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                {/* =====================================
                    Header
                ====================================== */}

                <div className="flex items-center justify-between border-b px-6 py-5">

                    <div>
                        <h2 className="text-xl font-semibold text-[#191c1e]">
                            Invite to ForgeFlow
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Invite a new member or add an existing member to a project.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="text-2xl text-gray-400 hover:text-gray-700"
                    >
                        ×
                    </button>

                </div>

                {/* =====================================
                    Invitation Type
                ====================================== */}

                <div className="px-6 pt-5">

                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">

                        <button
                            type="button"
                            onClick={() => {
                                setInviteType("new");
                                setError("");
                                setSuccess("");
                            }}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                inviteType === "new"
                                    ? "bg-white text-[#2036bd] shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            New Member
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setInviteType("existing");
                                setError("");
                                setSuccess("");
                            }}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                inviteType === "existing"
                                    ? "bg-white text-[#2036bd] shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Existing Member
                        </button>

                    </div>

                </div>

                {/* =====================================
                    Body
                ====================================== */}

                <div className="px-6 py-5">

                    {/* ==================================
                        NEW MEMBER
                    =================================== */}

                    {inviteType === "new" && (

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Name */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-[#454654]">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter member name"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#2036bd] focus:ring-1 focus:ring-[#2036bd]"
                                />

                            </div>

                            {/* Email */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-[#454654]">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter member email"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#2036bd] focus:ring-1 focus:ring-[#2036bd]"
                                />

                            </div>

                            {/* Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-[#454654]">
                                    Temporary Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter temporary password"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#2036bd] focus:ring-1 focus:ring-[#2036bd]"
                                />

                                <p className="mt-1 text-xs text-gray-500">
                                    The member can use this password when signing in.
                                </p>

                            </div>

                            {/* Success */}

                            {success && (
                                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                    {success}
                                </div>
                            )}

                            {/* Error */}

                            {error && (
                                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-[#2036bd] px-5 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Sending..."
                                        : "Send Invitation"}
                                </button>

                            </div>

                        </form>

                    )}

                    {/* ==================================
                        EXISTING MEMBER
                    =================================== */}

                    {inviteType === "existing" && (

    <form
        onSubmit={handleAddExistingMember}
        className="space-y-5"
    >

        {/* =====================================
            PROJECT
        ====================================== */}

        <div>

            <label className="mb-2 block text-sm font-medium text-[#454654]">
                Project
            </label>

            <select
                value={selectedProject}
                onChange={(e) => {

                    const projectId =
                        e.target.value;

                    setSelectedProject(
                        projectId
                    );

                    loadAvailableMembers(
                        projectId
                    );
                }}
                disabled={loadingProjects}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#2036bd] focus:ring-1 focus:ring-[#2036bd]"
            >

                <option value="">
                    {loadingProjects
                        ? "Loading projects..."
                        : "Select Project"}
                </option>

                {projects.map(
                    (project) => (

                        <option
                            key={project.id}
                            value={project.id}
                        >
                            {project.project_name}
                        </option>

                    )
                )}

            </select>

        </div>


        {/* =====================================
            EXISTING MEMBER
        ====================================== */}

        {selectedProject && (

            <div>

                <label className="mb-2 block text-sm font-medium text-[#454654]">
                    Existing Member
                </label>

                <select
                    value={selectedMember}
                    onChange={(e) =>
                        setSelectedMember(
                            e.target.value
                        )
                    }
                    disabled={loadingMembers}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#2036bd] focus:ring-1 focus:ring-[#2036bd]"
                >

                    <option value="">
                        {loadingMembers
                            ? "Loading members..."
                            : "Select Member"}
                    </option>

                    {availableMembers.map(
                        (member) => (

                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.name} —{" "}
                                {member.email}
                            </option>

                        )
                    )}

                </select>

                {!loadingMembers &&
                    selectedProject &&
                    availableMembers.length === 0 && (

                        <p className="mt-2 text-xs text-gray-500">
                            No eligible members are available
                            for this project.
                        </p>

                    )}

            </div>

        )}


        {/* =====================================
            PROJECT ROLE
        ====================================== */}

        {selectedMember && (

            <div>

                <label className="mb-2 block text-sm font-medium text-[#454654]">
                    Project Role
                </label>

                <select
                    value={permissionRole}
                    onChange={(e) =>
                        setPermissionRole(
                            e.target.value
                        )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#2036bd] focus:ring-1 focus:ring-[#2036bd]"
                >

                    <option value="member">
                        Member
                    </option>

                    <option value="manager">
                        Manager
                    </option>

                </select>

            </div>

        )}


        {/* =====================================
            SUCCESS
        ====================================== */}

        {success && (

            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
            </div>

        )}


        {/* =====================================
            ERROR
        ====================================== */}

        {error && (

            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>

        )}


        {/* =====================================
            BUTTONS
        ====================================== */}

        <div className="flex justify-end gap-3 pt-2">

            <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={
                    loading ||
                    !selectedProject ||
                    !selectedMember
                }
                className="rounded-lg bg-[#2036bd] px-5 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading
                    ? "Adding..."
                    : "Add Member"}
            </button>

        </div>

    </form>

)}


                </div>

            </div>

        </div>
    );
}