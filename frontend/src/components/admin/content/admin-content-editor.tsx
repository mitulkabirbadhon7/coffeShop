"use client";

import * as React from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Code,
  Layout,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  upsertSiteContentAction,
  toggleSiteContentPublishAction,
} from "@/lib/content/admin-content-actions";
import type { Database, Json } from "@/types/database.types";

type SiteContentRow = Database["public"]["Tables"]["site_content"]["Row"];

interface AdminContentEditorProps {
  initialContent: SiteContentRow[];
}

export function AdminContentEditor({ initialContent }: AdminContentEditorProps) {
  const [contentList, setContentList] = React.useState<SiteContentRow[]>(initialContent);
  const [activeKey, setActiveKey] = React.useState<string>(
    initialContent[0]?.content_key || "hero_section"
  );
  const [editorMode, setEditorMode] = React.useState<"visual" | "json">("visual");

  // Selected item state
  const selectedItem = contentList.find((c) => c.content_key === activeKey);

  // Form states for the active item
  const [rawJson, setRawJson] = React.useState<string>("");
  const [visualFields, setVisualFields] = React.useState<Record<string, string>>({});
  const [isPublished, setIsPublished] = React.useState<boolean>(false);
  const [jsonError, setJsonError] = React.useState<string | null>(null);

  // Status feedback
  const [loading, setLoading] = React.useState<boolean>(false);
  const [togglingStatus, setTogglingStatus] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync state whenever activeKey changes
  React.useEffect(() => {
    if (selectedItem) {
      setIsPublished(selectedItem.published);
      try {
        const jsonString = JSON.stringify(selectedItem.content || {}, null, 2);
        setRawJson(jsonString);
        setJsonError(null);

        // Populate visual fields if content is a key-value object of strings
        if (selectedItem.content && typeof selectedItem.content === "object" && !Array.isArray(selectedItem.content)) {
          const stringifiedEntries: Record<string, string> = {};
          for (const [k, v] of Object.entries(selectedItem.content as Record<string, unknown>)) {
            stringifiedEntries[k] = typeof v === "string" ? v : JSON.stringify(v);
          }
          setVisualFields(stringifiedEntries);
        } else {
          setVisualFields({});
        }
      } catch (e) {
        setRawJson("{}");
      }
    }
  }, [activeKey, selectedItem]);

  // Handle visual field update
  const handleVisualFieldChange = (key: string, value: string) => {
    const updated = { ...visualFields, [key]: value };
    setVisualFields(updated);
    setRawJson(JSON.stringify(updated, null, 2));
  };

  // Handle raw JSON update
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawJson(val);
    try {
      const parsed = JSON.parse(val);
      setJsonError(null);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const stringifiedEntries: Record<string, string> = {};
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          stringifiedEntries[k] = typeof v === "string" ? v : JSON.stringify(v);
        }
        setVisualFields(stringifiedEntries);
      }
    } catch (err: unknown) {
      setJsonError(err instanceof Error ? err.message : "Invalid JSON syntax");
    }
  };

  // Save content
  const handleSave = async (publishState = isPublished) => {
    setLoading(true);
    setFeedback(null);

    let parsedContent: Record<string, unknown>;
    try {
      parsedContent = JSON.parse(rawJson);
    } catch {
      setFeedback({ type: "error", message: "Please correct JSON syntax errors before saving." });
      setLoading(false);
      return;
    }

    const result = await upsertSiteContentAction({
      content_key: activeKey,
      content: parsedContent,
      published: publishState,
    });

    setLoading(false);

    if ("error" in result) {
      setFeedback({ type: "error", message: result.error });
    } else {
      setIsPublished(publishState);
      setFeedback({ type: "success", message: result.message });
      // Update local state list
      setContentList((prev) =>
        prev.map((item) =>
          item.content_key === activeKey
            ? {
                ...item,
                content: parsedContent as unknown as Json,
                published: publishState,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async () => {
    if (!selectedItem) return;
    setTogglingStatus(true);
    setFeedback(null);
    const nextStatus = !isPublished;

    const res = await toggleSiteContentPublishAction(activeKey, nextStatus);
    setTogglingStatus(false);

    if ("error" in res) {
      setFeedback({ type: "error", message: res.error });
    } else {
      setIsPublished(nextStatus);
      setFeedback({ type: "success", message: res.message });
      setContentList((prev) =>
        prev.map((item) =>
          item.content_key === activeKey
            ? { ...item, published: nextStatus, updated_at: new Date().toISOString() }
            : item
        )
      );
    }
  };

  // Helper labels for recognized section keys
  const getSectionTitle = (key: string) => {
    switch (key) {
      case "hero_section":
        return "Homepage Hero & Headline";
      case "story_section":
        return "Roastery Sourcing & Philosophy";
      case "store_info":
        return "Atelier Hours & Contact Info";
      default:
        return key
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and section selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
            Editorial Site Content
          </h1>
          <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
            Manage live headlines, brand storytelling, and store hours with sanitized outputs.
          </p>
        </div>

        {/* Action button toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={togglingStatus}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isPublished
                ? "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30 hover:bg-[#4ADE80]/25"
                : "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/25"
            }`}
          >
            {togglingStatus ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPublished ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
            <span>{isPublished ? "Status: Published" : "Status: Draft"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(isPublished)}
            disabled={loading || !!jsonError}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D4A373] text-[#1A1613] hover:bg-[#C29263] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]"
              : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Keys vs Editor Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section List (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 p-4 space-y-2">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-[#8A8179]">
            Content Sections
          </div>
          <div className="space-y-1">
            {contentList.map((item) => (
              <button
                key={item.content_key}
                type="button"
                onClick={() => setActiveKey(item.content_key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs ${
                  activeKey === item.content_key
                    ? "bg-[#2C221E] border border-[#D4A373]/50 text-[#F5E6D3] shadow-sm"
                    : "text-[#F5E6D3]/70 hover:bg-[#2C221E]/50 hover:text-[#F5E6D3]"
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="font-serif font-bold text-[#F5E6D3] truncate">
                    {getSectionTitle(item.content_key)}
                  </div>
                  <div className="text-[10px] text-[#8A8179] font-mono truncate">
                    {item.content_key}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                    item.published
                      ? "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30"
                      : "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                  }`}
                >
                  {item.published ? "Live" : "Draft"}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#5C4A3D]/30 px-3 flex items-center justify-between text-[11px] text-[#8A8179]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4A373]" />
              <span>Sanitization Active</span>
            </span>
            <span>{contentList.length} sections</span>
          </div>
        </div>

        {/* Right Editor Canvas (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#5C4A3D]/30 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#F5E6D3]">
                {getSectionTitle(activeKey)}
              </h2>
              <p className="text-[11px] text-[#8A8179] font-mono">
                Key: {activeKey} • Last updated:{" "}
                {selectedItem?.updated_at
                  ? new Date(selectedItem.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Never"}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex rounded-xl bg-[#2C221E] p-1 border border-[#5C4A3D]/40 text-xs">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                  editorMode === "visual"
                    ? "bg-[#D4A373] text-[#1A1613] font-semibold"
                    : "text-[#F5E6D3]/70 hover:text-[#F5E6D3]"
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Visual Fields</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode("json")}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                  editorMode === "json"
                    ? "bg-[#D4A373] text-[#1A1613] font-semibold"
                    : "text-[#F5E6D3]/70 hover:text-[#F5E6D3]"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw JSON</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Visual Fields */}
          {editorMode === "visual" && (
            <div className="space-y-4">
              {Object.keys(visualFields).length > 0 ? (
                Object.entries(visualFields).map(([fKey, fVal]) => {
                  const isLongText = fVal.length > 80 || fKey === "body" || fKey === "subtitle";
                  return (
                    <div key={fKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-medium text-[#F5E6D3] capitalize font-mono text-[11px]">
                          {fKey.replace(/_/g, " ")}
                        </label>
                        <span className="text-[10px] text-[#8A8179]">
                          {fVal.length} chars
                        </span>
                      </div>

                      {isLongText ? (
                        <textarea
                          rows={3}
                          value={fVal}
                          onChange={(e) => handleVisualFieldChange(fKey, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-[#F5E6D3] placeholder-[#8A8179] text-xs focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] resize-y"
                        />
                      ) : (
                        <input
                          type="text"
                          value={fVal}
                          onChange={(e) => handleVisualFieldChange(fKey, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 text-[#F5E6D3] placeholder-[#8A8179] text-xs focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#8A8179] space-y-2">
                  <FileText className="w-8 h-8 text-[#5C4A3D] mx-auto" />
                  <p>No structured string fields detected.</p>
                  <button
                    type="button"
                    onClick={() => setEditorMode("json")}
                    className="text-[#D4A373] underline"
                  >
                    Switch to Raw JSON editor
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Raw JSON Editor */}
          {editorMode === "json" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8A8179]">
                <span>JSON Payload (Max 15,000 chars)</span>
                <span>{rawJson.length} characters</span>
              </div>
              <textarea
                rows={14}
                value={rawJson}
                onChange={handleJsonChange}
                className={`w-full p-4 rounded-xl font-mono text-xs bg-[#1A1613] border text-[#F5E6D3] focus:outline-none resize-y ${
                  jsonError
                    ? "border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                    : "border-[#5C4A3D]/40 focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]"
                }`}
              />
              {jsonError && (
                <div className="text-[11px] text-[#EF4444] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}
            </div>
          )}

          {/* Safety & XSS notice */}
          <div className="p-3.5 rounded-xl bg-[#2C221E]/60 border border-[#5C4A3D]/30 text-[11px] text-[#8A8179] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>XSS Neutralization Policy:</strong> Stored content is automatically stripped of dangerous scripts, HTML tags, and event triggers before public rendering. Draft items remain strictly invisible on public storefront pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
