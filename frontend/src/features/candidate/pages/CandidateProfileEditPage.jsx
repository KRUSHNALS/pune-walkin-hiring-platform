import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  AwardIcon,
} from "../../../components/common/Icons";
import { useToast } from "../../../context/ToastContext";

const COMMON_SKILL_SUGGESTIONS = [
  "React.js",
  "JavaScript",
  "TypeScript",
  "Core Java",
  "Spring Boot",
  "MySQL",
  "PostgreSQL",
  "Docker",
  "Git",
  "Selenium",
  "Python",
  "REST APIs",
  "Tailwind CSS",
  "Node.js",
  "AWS",
];

export function CandidateProfileEditPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Pune",
    state: "Maharashtra",
    address: "",
    headline: "",
    about: "",
    isFresher: false,
    skills: [],
    education: [],
    experience: [],
  });

  // Local helper states for adding new items
  const [newSkill, setNewSkill] = useState("");
  const [newEdu, setNewEdu] = useState({
    qualification: "",
    course: "",
    institution: "",
    graduationYear: "2025",
    score: "",
  });
  const [showAddEdu, setShowAddEdu] = useState(false);

  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    duration: "",
    location: "Pune",
    description: "",
  });
  const [showAddExp, setShowAddExp] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const data = await candidateService.getProfile(user);
        setFormData({
          fullName: data.fullName || user?.name || "",
          email: data.email || user?.email || "",
          phone: data.phone || user?.phone || "",
          city: data.city || "Pune",
          state: data.state || "Maharashtra",
          address: data.address || "",
          headline: data.headline || "",
          about: data.about || "",
          isFresher: data.isFresher ?? false,
          skills: data.skills || [],
          education: data.education || [],
          experience: data.experience || [],
        });
      } catch (err) {
        showToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [user]);

  // Skill handlers
  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || newSkill).trim();
    if (!s) return;
    if (formData.skills.some((item) => item.toLowerCase() === s.toLowerCase())) {
      showToast("Skill is already added.", "info");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, s],
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    if (!newEdu.qualification || !newEdu.institution) {
      showToast("Please provide qualification and institution name.", "error");
      return;
    }
    const record = {
      id: `edu-${Date.now()}`,
      ...newEdu,
    };
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, record],
    }));
    setNewEdu({
      qualification: "",
      course: "",
      institution: "",
      graduationYear: "2025",
      score: "",
    });
    setShowAddEdu(false);
  };

  const handleRemoveEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company) {
      showToast("Please provide job/internship title and company name.", "error");
      return;
    }
    const record = {
      id: `exp-${Date.now()}`,
      ...newExp,
    };
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, record],
    }));
    setNewExp({
      title: "",
      company: "",
      duration: "",
      location: "Pune",
      description: "",
    });
    setShowAddExp(false);
  };

  const handleRemoveExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showToast("Name, email, and phone number are mandatory.", "error");
      return;
    }

    setSaving(true);
    try {
      await candidateService.updateProfile(user, formData);
      showToast("Candidate profile saved successfully!", "success");
      navigate("/candidate/profile");
    } catch (err) {
      showToast("Failed to save profile changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-64 rounded-xl bg-slate-200" />
        <div className="h-64 rounded-xl bg-slate-200" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Personal & Contact Information */}
      <Card title="Personal & Contact Details" padding="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Amit Deshmukh"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="candidate@example.com"
          />

          <Input
            label="Mobile Number (10 Digits)"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98901 23456"
          />

          <Input
            label="City"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Pune"
          />

          <Input
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Maharashtra"
          />

          <Input
            label="Headline / Role Title"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="e.g. Full Stack Developer | React & Java"
          />

          <div className="sm:col-span-2">
            <Input
              label="Residential Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. FC Road, Shivajinagar, Pune - 411005"
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Career Objective / Bio"
              as="textarea"
              rows={3}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Brief summary of your career objective and technical interests..."
            />
          </div>
        </div>
      </Card>

      {/* 2. Technical Skills */}
      <Card title="Technical Skills" subtitle="Add or remove technical competencies" padding="p-6">
        <div className="space-y-4">
          {/* Active Skills */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Your Skills ({formData.skills.length})
            </label>
            <div className="flex flex-wrap gap-2 min-h-10 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              {formData.skills.length > 0 ? (
                formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-3xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove skill"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 self-center">
                  No skills added yet. Type below or pick suggestions.
                </span>
              )}
            </div>
          </div>

          {/* Add custom skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type a skill and press Enter (e.g. React.js, Java, Spring Boot)"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={PlusIcon}
              onClick={() => handleAddSkill()}
            >
              Add Skill
            </Button>
          </div>

          {/* Suggestions */}
          <div>
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Popular Pune Hiring Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILL_SUGGESTIONS.map((s) => {
                const isSelected = formData.skills.some(
                  (item) => item.toLowerCase() === s.toLowerCase()
                );
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleAddSkill(s)}
                    className={`rounded-md px-2 py-1 text-2xs font-medium transition-colors ${
                      isSelected
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    }`}
                  >
                    + {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Education Entries */}
      <Card
        title="Education History"
        subtitle="Include college, graduation year, and percentage/CGPA"
        actions={
          !showAddEdu && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={PlusIcon}
              onClick={() => setShowAddEdu(true)}
            >
              Add Education
            </Button>
          )
        }
        padding="p-6"
      >
        <div className="space-y-4">
          {/* Existing Education List */}
          {formData.education.length > 0 ? (
            <div className="divide-y divide-slate-100 space-y-3">
              {formData.education.map((edu) => (
                <div
                  key={edu.id}
                  className="pt-3 first:pt-0 flex items-start justify-between gap-4"
                >
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{edu.qualification}</h5>
                    <p className="text-xs text-slate-600">{edu.course} • {edu.institution}</p>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      Graduation: {edu.graduationYear} | Score: {edu.score}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Delete education record"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No education entries recorded.</p>
          )}

          {/* Add Education Sub-form */}
          {showAddEdu && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                New Education Entry
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Qualification / Degree"
                  required
                  value={newEdu.qualification}
                  onChange={(e) => setNewEdu({ ...newEdu, qualification: e.target.value })}
                  placeholder="e.g. B.E. / B.Tech / MCA / B.Sc"
                />
                <Input
                  label="Course / Branch"
                  value={newEdu.course}
                  onChange={(e) => setNewEdu({ ...newEdu, course: e.target.value })}
                  placeholder="e.g. Computer Engineering"
                />
                <Input
                  label="College / University"
                  required
                  value={newEdu.institution}
                  onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                  placeholder="e.g. SPPU Pune / COEP / PCCOE"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Passing Year"
                    value={newEdu.graduationYear}
                    onChange={(e) => setNewEdu({ ...newEdu, graduationYear: e.target.value })}
                    placeholder="2025"
                  />
                  <Input
                    label="CGPA / Percentage"
                    value={newEdu.score}
                    onChange={(e) => setNewEdu({ ...newEdu, score: e.target.value })}
                    placeholder="e.g. 8.4 CGPA"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddEdu(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAddEducation}
                >
                  Save Entry
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 4. Experience & Fresher Toggle */}
      <Card
        title="Experience & Employment"
        subtitle="Specify internships or employment history"
        actions={
          !formData.isFresher &&
          !showAddExp && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={PlusIcon}
              onClick={() => setShowAddExp(true)}
            >
              Add Experience
            </Button>
          )
        }
        padding="p-6"
      >
        <div className="space-y-4">
          {/* Fresher Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFresher}
              onChange={(e) => setFormData({ ...formData, isFresher: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                I am a Fresher / 2024-2026 Batch Graduate
              </span>
              <span className="text-2xs text-slate-500">
                Select this if you do not have prior corporate experience.
              </span>
            </div>
          </label>

          {/* Experience list if not fresher */}
          {!formData.isFresher && (
            <>
              {formData.experience.length > 0 ? (
                <div className="divide-y divide-slate-100 space-y-3">
                  {formData.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="pt-3 first:pt-0 flex items-start justify-between gap-4"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{exp.title}</h5>
                        <p className="text-xs text-blue-600 font-medium">
                          {exp.company} • {exp.location} ({exp.duration})
                        </p>
                        <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete experience record"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No experience entries recorded. Click 'Add Experience' or check the Fresher box above.
                </p>
              )}

              {/* Add Experience Sub-form */}
              {showAddExp && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                    New Experience / Internship Record
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Job Title / Role"
                      required
                      value={newExp.title}
                      onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                      placeholder="e.g. Software Engineering Intern"
                    />
                    <Input
                      label="Company Name"
                      required
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                      placeholder="e.g. Persistent Systems Pune"
                    />
                    <Input
                      label="Duration"
                      value={newExp.duration}
                      onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                      placeholder="e.g. Jan 2025 - Jun 2025 (6 months)"
                    />
                    <Input
                      label="Location"
                      value={newExp.location}
                      onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                      placeholder="e.g. Hinjawadi, Pune"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Description of Responsibilities"
                        as="textarea"
                        rows={2}
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        placeholder="Key responsibilities and tools utilized..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddExp(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleAddExperience}
                    >
                      Save Entry
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/candidate/profile")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving} icon={CheckIcon}>
          Save Profile Changes
        </Button>
      </div>
    </form>
  );
}
