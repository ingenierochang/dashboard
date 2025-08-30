import React, { useState } from "react";
import Button from "@/components/common/Button";
import { useRestaurant } from "@/hooks/useRestaurant";
import client from "@/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import formatExampleImage from "@/components/specifics/products/bulkUpload/format-example.png";

const ProductsBulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { restaurant } = useRestaurant();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "xlsx" || fileExtension === "xls") {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError(
          "Por favor, seleccione un archivo Excel válido (.xlsx o .xls)"
        );
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Por favor, seleccione un archivo para subir");
      return;
    }

    if (!restaurant) {
      setError("La información del restaurante no está disponible");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await client.post(
        `/restaurants/${restaurant.slug}/products/bulk-upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      toast.success("¡Archivo subido exitosamente!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || error.message;
        if (errorMessage.includes("Excel file format cannot be determined")) {
          setError(
            "No se pudo determinar el formato del archivo Excel. Por favor, asegúrese de que está subiendo un archivo .xlsx o .xls válido."
          );
          toast.error(
            "Formato de archivo Excel inválido. Por favor, intente con un archivo o formato diferente."
          );
        } else {
          setError(errorMessage);
          toast.error(`Fallo en la subida: ${errorMessage}`);
        }
      } else if (error instanceof Error) {
        setError(error.message);
        toast.error(`Fallo en la subida: ${error.message}`);
      } else {
        setError("Ocurrió un error inesperado");
        toast.error("Fallo en la subida: Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Carga Masiva de Productos</h1>
      <p className="mb-4 text-sm text-gray-600">
        Por favor, suba un archivo Excel (.xlsx o .xls) que contenga los datos
        de sus productos.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 cursor-pointer"
          >
            Seleccionar Archivo Excel
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500 file:text-white
                      hover:file:bg-blue-800 cursor-pointer file:cursor-pointer"
          />
        </div>
        {file && restaurant && (
          <div className="flex justify-start">
            <Button
              text="Subir productos"
              isLoading={isLoading}
              className="mt-4 px-12 !w-fit !bg-green-500"
            />
          </div>
        )}
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-16">
        <div className="p-5 bg-white rounded-lg border border-gray-600 grid gap-4">
          <div>
            <p className="text-lg font-bold">
              Formato de subida para el archivo excel
            </p>
            <p className="italic text-gray-700 text-sm">
              * "name" y "category" son obligatorios
            </p>
            <p className="italic text-gray-700 text-sm">
              * Order sirve para ordenar los productos dentro de una categoría,
              el orden 1 es el puesto más alto
            </p>
          </div>
          <img src={formatExampleImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ProductsBulkUploadPage;
