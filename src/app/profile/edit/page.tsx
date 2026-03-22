"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";
import { getCurrentUserSnapshot, saveCurrentUserProfile } from "@/lib/client-simulation";

export default function EditProfilePage() {
  const router = useRouter();
  const currentUser = getCurrentUserSnapshot();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [website, setWebsite] = useState(currentUser.website ?? "");
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));

    // UploadThing is optional in this project; for now the preview is local only.
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    saveCurrentUserProfile({ name, bio, website, avatar: avatarPreview });
    setSaved(true);
    setToastOpen(true);
    setLoading(false);
    setTimeout(() => {
      router.push(`/profile/${currentUser.username}`);
      router.refresh();
    }, 800);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-8">Edit profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarPreview}
            alt="Avatar preview"
            className="w-16 h-16 rounded-full object-cover border border-gray-200"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700"
          >
            Change photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={150}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-gray-500 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/150</p>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yoursite.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || saved}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40"
        >
          {saved ? "Saved ✓" : loading ? "Saving…" : "Save changes"}
        </button>
      </form>

      <Toast
        open={toastOpen}
        message="usuario actualizado con exito"
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
