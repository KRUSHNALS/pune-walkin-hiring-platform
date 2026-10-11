import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  FileTextIcon,
  UploadIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  EyeIcon,
} from "../../../components/common/Icons";
import { useToast } from "../../../context/ToastContext";

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export function CandidateResumePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getProfile(user);
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();
  }, [user]);

  const handleFileProcess = async (file) => {
    if (!file) return;

    // Validate extension
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      showToast("Invalid file format. Please upload PDF, DOC, or DOCX.", "error");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit. Please choose a smaller file.", "error");
      return;
    }

    setUploading(true);
    try {
      const formattedSize =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
          : Math.round(file.size / 1024) + " KB";

      await candidateService.uploadResume(user, {
        fileName: file.name,
        fileSize: formattedSize,
        fileType: file.type || "application/pdf",
      });

      showToast(`Resume "${file.name}" uploaded successfully!`, "success");
      await loadResumeData();
    } catch (err) {
      showToast("Failed to update resume record.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove your active resume?")) {
      try {
        await candidateService.removeResume(user);
        showToast("Resume removed from profile.", "info");
        await loadResumeData();
      } catch (err) {
        showToast("Failed to remove resume.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-40 rounded-xl bg-slate-200" />
        <div className="h-64 rounded-xl bg-slate-200" />
      </div>
    );
  }

  const resume = profile?.resume;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Informative Header Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
          <FileTextIcon className="h-6 w-6" />
        </div>
        <div className="space-y-1 flex-1">
          <h2 className="text-base font-bold text-slate-900">
            Candidate Resume Management
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your attached resume is screened by Pune technical recruiters (such as TechSprint Innovations) whenever you register for walk-in drives. Ensure your latest education, tech stack, and contact details are accurate.
          </p>
          <div className="pt-2 flex items-center gap-2 text-2xs font-semibold text-blue-700">
            <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
            <span>Frontend Prototype: File metadata is safely scoped to your candidate account.</span>
          </div>
        </div>
      </div>

      {/* Active Resume Card */}
      {resume?.fileName ? (
        <Card
          title="Active Resume"
          subtitle="Currently submitted with all walk-in registrations"
          padding="p-6"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                  <FileTextIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{resume.fileName}</h4>
                    <Badge variant="success" size="sm">
                      Verified Active
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Size: {resume.fileSize} • Uploaded: {resume.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploading}
                >
                  Replace Resume
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={TrashIcon}
                  onClick={handleRemove}
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* Quick Resume Tips */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-2xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Format: PDF / Word Doc</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>2 Printed copies required at venue</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Auto-attached to drive passes</span>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Upload Dropzone */}
      <Card
        title={resume?.fileName ? "Replace Resume File" : "Upload New Resume"}
        subtitle="Supported formats: PDF, DOC, DOCX (Max 5MB)"
        padding="p-6"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 border border-slate-200 shadow-xs mb-3">
            <UploadIcon className="h-7 w-7" />
          </div>

          <h4 className="text-sm font-bold text-slate-800">
            {uploading ? "Uploading resume..." : "Click to select or drag and drop your resume file"}
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Make sure your contact email and phone in the resume match your Pune Walk-In profile.
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={uploading}
              icon={UploadIcon}
            >
              Browse Computer File
            </Button>
          </div>
        </div>
      </Card>

      {/* Pune Walk-In Drive Resume Guidelines */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 text-xs text-slate-600">
        <h4 className="font-bold text-slate-900 uppercase tracking-wide text-2xs flex items-center gap-2">
          <AlertCircleIcon className="h-4 w-4 text-blue-600" />
          Walk-In Interview Preparation Instructions
        </h4>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            Even though your resume is registered digitally on the platform, <strong>every candidate must carry at least two physical printed copies</strong> to the drive venue in Pune.
          </li>
          <li>
            Highlight technical projects, GitHub profile links, and specific frameworks (e.g. React, Spring Boot, Selenium).
          </li>
          <li>
            Bring your government photo identification (Aadhaar or PAN) to present at campus security (Magarpatta / Hinjawadi IT parks).
          </li>
        </ul>
      </div>
    </div>
  );
}
