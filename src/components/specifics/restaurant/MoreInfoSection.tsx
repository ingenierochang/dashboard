import { Restaurant } from "@/types/restaurant";
import React from "react";

interface MoreInfoSectionProps {
  formData: Partial<Restaurant>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const MoreInfoSection: React.FC<MoreInfoSectionProps> = ({
  formData,
  onChange,
}) => (
  <section className="bg-white rounded-lg border border-gray-300 p-3">
    <h3 className="font-bold mb-3">Más información</h3>
    <label className="block mb-2">
      <p className="text-sm mb-1">Horarios</p>
      <textarea
        name="open_hours"
        value={formData.open_hours || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300  w-[25rem] h-[10rem]"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">Métodos de pago</p>
      <textarea
        name="payment_methods"
        value={formData.payment_methods || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300  w-[25rem] h-[10rem]"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">Estacionamientos</p>
      <input
        type="text"
        name="parking"
        value={formData.parking || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">Patentes de alcohol</p>
      <input
        type="text"
        name="alcohol_patents"
        value={formData.alcohol_patents || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
    <br />
    <label className="block mb-2">
      <p className="text-sm mb-1">Sitio web</p>
      <input
        type="text"
        name="website"
        value={formData.website || ""}
        onChange={onChange}
        className="bg-gray-100 p-1 rounded border border-gray-300"
      />
    </label>
  </section>
);

export default MoreInfoSection;
