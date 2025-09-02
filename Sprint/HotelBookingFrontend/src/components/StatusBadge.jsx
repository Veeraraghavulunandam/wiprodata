// src/components/StatusBadge.jsx
import React from "react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Confirmed: "bg-green-100 text-green-800 border border-green-300",
  Cancelled: "bg-red-100 text-red-800 border border-red-300",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800 border"
      }`}
    >
      {status}
    </span>
  );
}
