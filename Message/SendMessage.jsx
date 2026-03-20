import { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios.js";

const initialFilters = {
  recipientType: "student",
  course: "",
  semester: "",
  section: "",
  wrn: "",
  search: "",
  pendingOnly: false,
  minPending: "",
};

const buildRecipientKey = (item) => {
  if (item?._id) return String(item._id);
  return [
    item?.role || "student",
    item?.name || "",
    item?.mobile1 || "",
    item?.wrn || "",
    item?.sourceId || "",
  ]
    .filter(Boolean)
    .join("-");
};

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
};

const SendMessage = () => {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [status, setStatus] = useState(null);
  const [records, setRecords] = useState([]);
  const [notice, setNotice] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const selectedCount = selected.length;

  const statusLabel = useMemo(() => {
    if (!status) return "checking...";
    if (status.isReady) return "connected";
    if (status.status === "qr") return "scan qr";
    if (status.status === "connecting") return "connecting";
    return status.status || "offline";
  }, [status]);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/message/status");
      setStatus(res.data);
    } catch (error) {
      setNotice(error.message);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await api.get("/message/records?limit=10");
      if (res.data.success) setRecords(res.data.result || []);
    } catch (error) {
      setNotice(error.message);
    }
  };

  const fetchContacts = async (nextFilters = filters) => {
    try {
      setListLoading(true);
      const params = new URLSearchParams();
      params.set("target", nextFilters.recipientType || "student");
      if (nextFilters.course) params.set("course", nextFilters.course);
      if (nextFilters.semester) params.set("semester", nextFilters.semester);
      if (nextFilters.section) params.set("section", nextFilters.section);
      if (nextFilters.wrn) params.set("wrn", nextFilters.wrn);
      if (nextFilters.search) params.set("search", nextFilters.search);
      if (nextFilters.pendingOnly) params.set("pendingOnly", "true");
      if (nextFilters.minPending) params.set("minPending", nextFilters.minPending);

      const res = await api.get(`/message/contacts?${params.toString()}`);
      if (res.data.success) {
        setContacts(res.data.result || []);
        setSelected([]);
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchContacts();
    fetchRecords();

    const timer = setInterval(fetchStatus, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelect = (item) => {
    const key = buildRecipientKey(item);
    if (selected.includes(key)) {
      setSelected(selected.filter((id) => id !== key));
      return;
    }
    setSelected([...selected, key]);
  };

  const selectAll = () => {
    setSelected(contacts.map(buildRecipientKey));
  };

  const clearSelection = () => setSelected([]);

  const onFilterChange = (key, value) => {
    const next = {
      ...filters,
      [key]: value,
    };

    if (key === "recipientType" && value !== "student") {
      next.pendingOnly = false;
      next.minPending = "";
    }

    setFilters(next);
    if (key === "recipientType" || key === "pendingOnly" || key === "minPending") {
      fetchContacts(next);
      return;
    }
  };

  const applyFilters = () => fetchContacts(filters);

  const importExcel = async (file) => {
    if (!file) return;

    try {
      setExcelLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const base64 = toBase64(arrayBuffer);
      const res = await api.post("/message/import-excel", {
        base64,
        fileName: file.name,
        role: filters.recipientType === "teacher" ? "teacher" : "student",
      });

      if (res.data.success) {
        setNotice(`${res.data.inserted} contacts imported from ${file.name}`);
        if (filters.recipientType === "excel") {
          fetchContacts(filters);
        }
        fetchRecords();
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setExcelLoading(false);
    }
  };

  const reconnect = async () => {
    try {
      setNotice("Reconnecting WhatsApp...");
      await api.post("/message/connect");
      await fetchStatus();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const sendMessage = async () => {
    const selectedContacts = contacts.filter((item) => selected.includes(buildRecipientKey(item)));

    if (!message.trim()) {
      setNotice("Please type a message first");
      return;
    }

    if (!selectedContacts.length) {
      setNotice("Please select at least one recipient");
      return;
    }

    try {
      setSending(true);
      const res = await api.post("/message/send-message", {
        contacts: selectedContacts,
        message,
        recipientType: filters.recipientType,
        filters,
        source: filters.recipientType === "excel" ? "excel" : "manual",
        title: `Bulk ${filters.recipientType} message`,
      });

      if (res.data.success) {
        setNotice(
          `Sent ${res.data.sentCount} message(s), failed ${res.data.failedCount || 0}, record saved`
        );
        fetchRecords();
      } else {
        setNotice(res.data.message || "Message send failed");
      }
    } catch (error) {
      setNotice(error.response?.data?.message || error.message);
    } finally {
      setSending(false);
    }
  };

  const qrImage = status?.qrUrl || "";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-3xl font-black tracking-tight text-slate-900">WhatsApp Messaging</p>
            <p className="mt-1 text-sm text-slate-500">
              Connect once, scan QR here, and send filtered messages to students, teachers, or uploaded Excel contacts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Status: {statusLabel}
            </span>
            <button
              onClick={reconnect}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Connect / Refresh
            </button>
          </div>
        </div>

        {notice && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{notice}</p>}

        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">QR Login</p>
            <p className="mt-1 text-xs text-slate-500">
              Scan this QR from WhatsApp once. The connection will stay available on this server session.
            </p>
            <div className="mt-3 flex min-h-60 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-3">
              {qrImage ? (
                <img src={qrImage} alt="WhatsApp QR code" className="h-56 w-56 object-contain" />
              ) : (
                <div className="text-center text-sm text-slate-400">
                  {status?.isReady ? "WhatsApp already connected" : "QR will appear here when available"}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Recipient Type</span>
                <select
                  value={filters.recipientType}
                  onChange={(e) => onFilterChange("recipientType", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                >
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="excel">Excel Contacts</option>
                  <option value="all">All</option>
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Class / Course</span>
                <input
                  value={filters.course}
                  onChange={(e) => onFilterChange("course", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="BCA / BBA / MCA"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Semester</span>
                <input
                  value={filters.semester}
                  onChange={(e) => onFilterChange("semester", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="1, 2, 3..."
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Section</span>
                <input
                  value={filters.section}
                  onChange={(e) => onFilterChange("section", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="A / B / C"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">WRN</span>
                <input
                  value={filters.wrn}
                  onChange={(e) => onFilterChange("wrn", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="WRN number"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Search</span>
                <input
                  value={filters.search}
                  onChange={(e) => onFilterChange("search", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="Name / phone / destination"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Min Pending Fees</span>
                <input
                  type="number"
                  min="0"
                  value={filters.minPending}
                  onChange={(e) => onFilterChange("minPending", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="500"
                />
              </label>

              <label className="flex items-end gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.pendingOnly}
                  onChange={(e) => onFilterChange("pendingOnly", e.target.checked)}
                />
                <span className="font-medium text-slate-700">Pending fees only</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={applyFilters}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Load Filtered Contacts
              </button>
              <button
                onClick={selectAll}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Select All ({contacts.length})
              </button>
              <button
                onClick={clearSelection}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
              >
                Clear Selection
              </button>
              <button
                onClick={sendMessage}
                disabled={sending || !selectedCount}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Sending..." : `Send Message (${selectedCount})`}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Compose Message</p>
                    <p className="text-xs text-slate-500">
                      The message will be wrapped with ERP header and signature automatically.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {contacts.length} loaded
                  </span>
                </div>

                <textarea
                  rows="7"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-slate-500"
                  placeholder="Type message here..."
                />

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                    <span className="mr-2">{excelLoading ? "Importing..." : "Import Excel"}</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={(e) => importExcel(e.target.files?.[0])}
                      disabled={excelLoading}
                    />
                  </label>
                  <p className="text-xs text-slate-500">
                    Excel columns can include name, mobile, wrn, course/class, semester, section, role.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Recent Records</p>
                <div className="mt-3 space-y-3">
                  {records.length ? (
                    records.map((record) => (
                      <div key={record._id} className="rounded-lg bg-slate-50 p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">{record.title || "Bulk message"}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(record.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 text-slate-600">
                          {record.sentCount}/{record.totalRecipients} sent, {record.failedCount} failed
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-400">
                      No message records yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Contacts</p>
                  <p className="text-xs text-slate-500">
                    Use the checkboxes to message a subset of the filtered list.
                  </p>
                </div>
                <button
                  onClick={applyFilters}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {listLoading ? "Loading..." : "Refresh List"}
                </button>
              </div>

              <div className="max-h-[28rem] overflow-auto">
                {contacts.length ? (
                  contacts.map((item) => {
                    const key = buildRecipientKey(item);
                    const pending = Number(item.pendingFees || 0);

                    return (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(key)}
                            onChange={() => toggleSelect(item)}
                          />
                          <div>
                            <div className="font-medium text-slate-900">
                              {item.name || "Unnamed"}{" "}
                              <span className="text-xs text-slate-500">({item.role || filters.recipientType})</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.mobile1 || item.mobile || "No mobile"}{" "}
                              {item.wrn ? ` - WRN ${item.wrn}` : ""}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs text-slate-500">
                          <div>
                            {item.course ? `${item.course}` : "N/A"}
                            {item.semester ? ` / Sem ${item.semester}` : ""}
                            {item.section ? ` / Sec ${item.section}` : ""}
                          </div>
                          {filters.recipientType === "student" && (
                            <div className={pending > 0 ? "font-semibold text-rose-600" : "text-emerald-600"}>
                              {pending > 0 ? `Pending Fees: ${pending}` : "Fees Clear"}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="p-6 text-sm text-slate-400">
                    No contacts found. Try changing the filters or importing Excel data.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
