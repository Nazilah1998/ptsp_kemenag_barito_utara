"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog } from "../ui/alert-dialog";

export function DeleteRequestButton({
  requestId,
  status,
}: {
  requestId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Only allow deletion if status is submitted or under_review
  const canDelete = ["submitted", "under_review", "revision_required"].includes(
    status,
  );

  if (!canDelete) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/requests/${requestId}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus pengajuan.");
      }

      toast.success("Berhasil", {
        description: "Pengajuan telah dibatalkan dan dihapus.",
      });
      router.push("/dashboard/pengajuan");
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal", {
        description: err.message || "Terjadi kesalahan saat menghapus.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
        onClick={() => setIsAlertOpen(true)}
        disabled={loading}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>{loading ? "Menghapus..." : "Hapus"}</span>
      </Button>

      <AlertDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Batalkan & Hapus Pengajuan?"
        description="Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini akan menghapus semua data dan dokumen yang telah diunggah secara permanen. Data yang sudah dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus Sekarang"
        cancelText="Jangan Sekarang"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}
