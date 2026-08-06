"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiPlus, FiAlertTriangle } from "react-icons/fi";
import styles from "./brands.module.css";
import { Brand } from "@/types/brand";
import { fetchBrands, deleteBrand } from "@/lib/api/brands";
import { getAssetUrl } from "@/lib/getAssetUrl";

export default function BrandsListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    setLoading(true);
    try {
      const data = await fetchBrands();
      setBrands(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBrand(deleteTarget._id);
      setBrands((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete brand");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Trusted Brands</h1>
          <p className={styles.subtitle}>Manage brand logos shown on the homepage marquee</p>
        </div>
        <Link href="/admin/brands/add-new" className={styles.addBtn}>
          <FiPlus /> Add New Brand
        </Link>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p className={styles.stateText}>Loading brands...</p>
      ) : brands.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No brands added yet.</p>
          <Link href="/admin/brands/add-new" className={styles.addBtn}>
            <FiPlus /> Add your first brand
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Alt Text</th>
                <th>Row</th>
                <th>Order</th>
                <th>Status</th>
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => {
                const logoUrl = getAssetUrl(brand.logo);
                return (
                  <tr key={brand._id}>
                    <td>
                      <div className={styles.logoCell}>
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={brand.alt}
                            width={90}
                            height={40}
                            className={styles.logoImg}
                            unoptimized
                          />
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#666" }}>No logo</span>
                        )}
                      </div>
                    </td>
                    <td>{brand.name}</td>
                    <td className={styles.altCell}>{brand.alt}</td>
                    <td>
                      <span className={styles.rowBadge}>
                        {brand.row === "rowOne" ? "Row 1" : "Row 2"}
                      </span>
                    </td>
                    <td>{brand.order}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          brand.isActive ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/admin/brands/${brand._id}`}
                          className={styles.iconBtn}
                          title="Edit brand"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                          title="Delete brand"
                          onClick={() => setDeleteTarget(brand)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <FiAlertTriangle className={styles.modalIcon} />
            <h3 className={styles.modalTitle}>Delete Brand?</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action
              cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}