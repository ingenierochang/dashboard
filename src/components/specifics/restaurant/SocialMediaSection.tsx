import { Restaurant } from "@/types/restaurant";
import React from "react";

interface SocialMediaSectionProps {
  formData: Partial<Restaurant>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  formData,
  onChange,
}) => (
  <section className="bg-white rounded-lg border border-gray-300 p-3">
    <h3 className="font-bold mb-3">Redes sociales</h3>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">WhatsApp</p>
      <input
        type="text"
        name="whatsapp"
        value={formData.whatsapp || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">Facebook</p>
      <input
        type="text"
        name="facebook"
        value={formData.facebook || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">Instagram</p>
      <input
        type="text"
        name="instagram"
        value={formData.instagram || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">TikTok</p>
      <input
        type="text"
        name="tiktok"
        value={formData.tiktok || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
    <br />
  </section>
);

export default SocialMediaSection;
