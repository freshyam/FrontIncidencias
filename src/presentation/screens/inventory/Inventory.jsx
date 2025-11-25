// src/presentation/screens/inventory/Inventory.jsx 
import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Plus, MessageSquareText, AlertTriangle } from "lucide-react";
import InventoryTable from "../../components/inventory/InventoryTable";
import NewProductModal from "../../components/inventory/NewProductModal";
import AdjustStockModal from "../../components/inventory/AdjustStockModal";
import AdjustmentModal from "../../components/inventory/Adjustment";


const GET_INVENTORY = gql`
  query GetInventory {
    GetInventory {
      stockMinimo
      stockActual
      status
      nombre
      id
      categoria
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategorias {
    GetCategorias {
      id
      nombre_cat
    }
  }
`;

// 🔹 Mutations
const CREATE_CATEGORIA = gql`
  mutation CreateCategoria($input: CreateCategoriaInput!) {
    CreateCategoria(input: $input) {
      id
      nombre_cat
    }
  }
`;

const CREATE_PRODUCTO = gql`
  mutation CreateProducto($input: CreateProductoInput!) {
    CreateProducto(input: $input) {
      id
      nombre
      categoria
      status
      stockActual
      stockMinimo
    }
  }
`;

// 🔹 NUEVA: Ajustar stock
const AJUSTAR_STOCK_PRODUCTO = gql`
  mutation AjustarStockProducto($input: AjustarStockInput!) {
    AjustarStockProducto(input: $input) {
      id
      nombre
      categoria
      status
      stockActual
      stockMinimo
    }
  }
`;

const mapProductFromApi = (item) => ({
  id: item.id,
  name: item.nombre,
  category: item.categoria,
  stock: item.stockActual,
  minStock: item.stockMinimo,
  status: item.status,
  location: null,
});

const Inventory = () => {
  const [open, setOpen] = useState(false); // modal nuevo producto
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔹 producto seleccionado para ajustar stock
  const [productToAdjust, setProductToAdjust] = useState(null);

  const {
    data: inventoryData,
    loading: loadingInventory,
    error: errorInventory,
  } = useQuery(GET_INVENTORY);

  const {
    data: categoriesData,
    loading: loadingCategories,
    error: errorCategories,
  } = useQuery(GET_CATEGORIES);

   const [openAdjustments, setOpenAdjustments] = useState(false);

  const [createCategoria] = useMutation(CREATE_CATEGORIA);
  const [createProducto] = useMutation(CREATE_PRODUCTO);
  const [ajustarStock, { loading: adjustingStock }] = useMutation(
    AJUSTAR_STOCK_PRODUCTO
  );

  // Cargar productos
  useEffect(() => {
    if (inventoryData?.GetInventory) {
      setProducts(inventoryData.GetInventory.map(mapProductFromApi));
    }
  }, [inventoryData]);

  // Cargar categorías
  useEffect(() => {
    if (categoriesData?.GetCategorias) {
      setCategories(categoriesData.GetCategorias);
    }
  }, [categoriesData]);

  // 🔹 Crear producto
  const handleCreateProduct = async (values) => {
    const input = {
      descripcion: values.name,
      categoriaId: Number(values.categoryId),
      stockActual: Number(values.stock),
      stockMinimo: Number(values.minStock),
      status: 1,
    };

    const { data } = await createProducto({
      variables: { input },
    });

    if (data?.CreateProducto) {
      const mapped = mapProductFromApi(data.CreateProducto);
      setProducts((prev) => [...prev, mapped]);
      return mapped;
    }
  };

  // 🔹 Crear categoría
  const handleCreateCategory = async (nombre_cat) => {
    const { data } = await createCategoria({
      variables: { input: { nombre_cat } },
    });

    if (data?.CreateCategoria) {
      setCategories((prev) => [...prev, data.CreateCategoria]);
      return data.CreateCategoria;
    }
  };

  // 🔹 Abrir modal de ajuste desde la tabla
  const handleOpenAdjustModal = (product) => {
    setProductToAdjust(product);
  };

  // 🔹 Cerrar modal de ajuste
  const handleCloseAdjustModal = () => {
    setProductToAdjust(null);
  };

  // 🔹 Enviar ajuste al backend
  const handleAdjustStockSubmit = async ({ id, nuevoStock, nota }) => {
    const { data } = await ajustarStock({
      variables: {
        input: {
          idProducto: id,
          nuevoStock: Number(nuevoStock),
          nota,
        },
      },
    });

    if (data?.AjustarStockProducto) {
      const updated = mapProductFromApi(data.AjustarStockProducto);

      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );

      return updated;
    }

    return null;
  };

  const lowStockCount = products.filter(
    (p) => p.stock <= p.minStock
  ).length;

  if ((loadingInventory && !products.length) || loadingCategories) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-gray-600">Cargando inventario...</p>
      </div>
    );
  }

  if (errorInventory) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-red-600">
          Error al cargar inventario: {errorInventory.message}
        </p>
      </div>
    );
  }

  if (errorCategories) {
    console.error("Error al cargar categorías:", errorCategories);
  }

 

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Inventario de Productos
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona el stock de equipos y accesorios
          </p>
        </div>
         

        <button
            type="button"
            onClick={() => setOpenAdjustments(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          ><MessageSquareText />
            Movimiento
          </button>


        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          disabled={!categories.length}
          title={
            categories.length
              ? ""
              : "No hay categorías, crea una desde el tab en el modal"
          }
        >
          <Plus className="h-4 w-4" />
          Agregar Producto
        </button>
      </div>

      {/* Alert stock bajo */}
      {lowStockCount > 0 && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-gray-800">
              Tienes{" "}
              <span className="font-bold text-amber-700">
                {lowStockCount}
              </span>{" "}
              producto{lowStockCount > 1 ? "s" : ""} con stock bajo
              o crítico
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      <InventoryTable
        products={products}
        onOpenAdjust={handleOpenAdjustModal}
      />

      {/* Modal Nuevo producto */}
      <NewProductModal
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        onCreateProduct={handleCreateProduct}
        onCreateCategory={handleCreateCategory}
      />

      {/* Modal Ajuste de stock */}
      <AdjustStockModal
        open={!!productToAdjust}
        product={productToAdjust}
        loading={adjustingStock}
        onClose={handleCloseAdjustModal}
        onSubmit={handleAdjustStockSubmit}
      />

      <AdjustmentModal
        open={openAdjustments}
        onClose={() => setOpenAdjustments(false)}
      />
    </div>
  );
};

export default Inventory;
