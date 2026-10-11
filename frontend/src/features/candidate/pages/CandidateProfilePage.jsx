import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  EditIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  FileTextIcon,
  CheckCircleIcon,
  AwardIcon,
} from "../../../components/common/Icons";

export function CandidateProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await candidateService.getProfile(user);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 rounded-2xl bg-slate-200" />
        <div className="h-64 rounded-xl bg-slate-200" />
        <div className="h-64 rounded-xl bg-slate-200" />
      </div>
    );
  }

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-sm shrink-0">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {profile.fullName}
                </h2>
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {profile.headline || "Pune Walk-In Candidate"}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-slate-400" />
                  {profile.city}, {profile.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MailIcon className="h-3.5 w-3.5 text-slate-400" />
                  {profile.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <PhoneIcon className="h-3.5 w-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/candidate/profile/edit">
              <Button variant="primary" icon={EditIcon}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Profile Completeness:</span>
            <span className="font-bold text-blue-700">
              {profile.completionPercentage}% Complete
            </span>
          </div>
          <div className="w-full sm:w-64 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${profile.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. About & Summary */}
      <Card title="About & Career Objective" padding="p-6">
        <p className="text-sm text-slate-700 leading-relaxed">
          {profile.about || "No summary added yet. Click edit profile to add your objective."}
        </p>
        {profile.address && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
            <MapPinIcon className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Residential Address:</strong> {profile.address}
            </span>
          </div>
        )}
      </Card>

      {/* 3. Education Section */}
      <Card
        title="Education & Qualifications"
        subtitle="Academic records and marks certified for Pune hiring"
        actions={
          <Link to="/candidate/profile/edit">
            <Button variant="ghost" size="sm" icon={EditIcon}>
              Manage Education
            </Button>
          </Link>
        }
        padding="p-6"
      >
        {profile.education && profile.education.length > 0 ? (
          <div className="divide-y divide-slate-100 space-y-4">
            {profile.education.map((edu) => (
              <div key={edu.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                    <AcademicCapIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{edu.qualification}</h4>
                    <p className="text-xs font-medium text-slate-600">{edu.course}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.institution}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-slate-900 block">{edu.graduationYear}</span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm inline-block mt-1">
                    Score: <strong>{edu.score}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No education entries added yet.
          </div>
        )}
      </Card>

      {/* 4. Technical Skills */}
      <Card
        title="Technical Skills & Competencies"
        subtitle="Key technologies verified during walk-in technical rounds"
        actions={
          <Link to="/candidate/profile/edit">
            <Button variant="ghost" size="sm" icon={EditIcon}>
              Add / Remove Skills
            </Button>
          </Link>
        }
        padding="p-6"
      >
        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-3xs"
              >
                <AwardIcon className="h-3.5 w-3.5 text-blue-600" />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No skills added yet.
          </div>
        )}
      </Card>

      {/* 5. Experience / Internship */}
      <Card
        title="Experience & Internships"
        subtitle="Industry experience and technical projects"
        actions={
          <Link to="/candidate/profile/edit">
            <Button variant="ghost" size="sm" icon={EditIcon}>
              Manage Experience
            </Button>
          </Link>
        }
        padding="p-6"
      >
        {profile.isFresher ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Status: Fresher / Entry Level Candidate</p>
            <p className="mt-0.5 text-slate-500">
              Eligible for graduate, campus, and entry-level walk-in drives across Pune.
            </p>
          </div>
        ) : profile.experience && profile.experience.length > 0 ? (
          <div className="divide-y divide-slate-100 space-y-4">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                    <p className="text-xs font-medium text-blue-600">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No work experience recorded. Freshers welcome.
          </div>
        )}
      </Card>

      {/* 6. Resume Preview / Shortcut */}
      <Card
        title="Resume Attachment"
        subtitle="Current resume submitted during walk-in registrations"
        padding="p-6"
      >
        {profile.resume?.fileName ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-blue-200 bg-blue-50/40 p-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
                <FileTextIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{profile.resume.fileName}</p>
                <p className="text-xs text-slate-500">
                  Size: {profile.resume.fileSize} • Uploaded: {profile.resume.uploadedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/candidate/resume">
                <Button variant="outline" size="sm">
                  Manage Resume
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 space-y-2">
            <FileTextIcon className="h-8 w-8 text-slate-300 mx-auto" />
            <p>No resume file uploaded yet.</p>
            <Link to="/candidate/resume">
              <Button variant="primary" size="sm">
                Upload Resume Now
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
