"use client";

import { useState, useEffect } from "react";
import { User, Download, Trash2, Save, AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/ButtonT";
import Input from "@/components/ui/InputT";
import Card from "@/components/ui/CardT";
import { updateUserProfile, deleteUserAccount } from "@/server/actions/user";
import { useLinksContext } from "@/components/providers/links-provider";

export default function Settings() {
  const { data: session } = authClient.useSession();
  const { links, loading } = useLinksContext()
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
  });
  
  useEffect(() => {
    if (session?.user?.name) {
      setFormData({ name: session.user.name });
    }
  }, [session?.user?.name]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateUserProfile(formData.name);
      await authClient.updateUser({
        name: formData.name,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportLinks = async () => {
    if (loading || links.length === 0) return;

    setIsExporting(true);

    try {
      const exportData = links.map((link) => ({
        id: link.id,
        originalUrl: link.originalUrl,
        shortUrl: `${window.location.origin}/${link.customAlias}`,
        alias: link.customAlias,
        clicks: link.clicks,
        createdAt: link.createdAt.toISOString(),
      }));

      const exportStats = {
        totalLinks: links.length,
        totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
        exportedBy: session?.user?.email,
        exportedAt: new Date().toISOString(),
      };

      const fullExport = {
        metadata: exportStats,
        links: exportData,
      };

      const dataStr = JSON.stringify(fullExport, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `nex-url-export-${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      toast.success("Links exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export links");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      await authClient.signOut();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="text-black dark:text-white font-light text-center">
        Please sign in to access settings.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <User className="h-8 w-8 text-black dark:text-white" />
        <h1 className="text-3xl font-extralight tracking-tight text-black dark:text-white">
          Account Settings
        </h1>
      </div>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-black dark:text-white">
            Profile Information
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isEditing) {
                setFormData({
                  name: session?.user?.name || "",
                });
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-light text-black/70 dark:text-white/70 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full"
              />
            ) : (
              <p className="text-black dark:text-white font-light">
                {session.user.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-light text-black/70 dark:text-white/70 mb-2"
            >
              Email Address
            </label>
            <p className="text-black dark:text-white font-light">
              {session.user.email}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-8">
        <h2 className="text-xl font-light text-black dark:text-white mb-6">
          Data Management
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/20 rounded-lg">
            <div>
              <h3 className="font-light text-black dark:text-white">
                Export Links
              </h3>
              <p className="text-sm text-black/70 dark:text-white/70 font-light">
                Download all your shortened links as JSON ({links.length} links,{" "}
                {links.reduce((sum, link) => sum + link.clicks, 0)} total
                clicks)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportLinks}
              disabled={loading || links.length === 0 || isExporting}
              className="flex items-center space-x-2"
            >
              <Download size={16} />
              <span>{isExporting ? "Exporting..." : "Export"}</span>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-red-200 dark:border-red-800">
        <h2 className="text-xl font-light text-red-600 dark:text-red-400 mb-6 flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>Danger Zone</span>
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h3 className="font-light text-red-600 dark:text-red-400">
                Delete Account
              </h3>
              <p className="text-sm text-red-600/70 dark:text-red-400/70 font-light">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 size={16} />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-black">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-light text-black dark:text-white">
                Delete Account
              </h3>
            </div>

            <p className="text-black/70 dark:text-white/70 font-light mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently remove all your data.
            </p>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
