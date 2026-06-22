# POS Showcase Frontend 🚀

Un sistema de Punto de Venta (POS) y Monitor de Cocina (KDS) construido con **React, TypeScript y Vite**. Diseñado como un proyecto de demostración (Showcase) para portafolios, enfocado en mostrar habilidades avanzadas en desarrollo Frontend, gestión de estado global y maquetación de interfaces modernas.

## 🌟 Características Principales

* **Terminal de Ventas (POS):** Toma de pedidos, catálogo de productos interactivo, gestión de "extras" (add-ons) y cálculo automático de totales incluyendo costos de envío dinámicos.
* **Monitor de Cocina (KDS Kanban):** Tablero en tiempo real que refleja las órdenes entrantes. Las tarjetas cambian de estado y muestran temporizadores dinámicos para indicar el tiempo de preparación.
* **Dashboard de Reportes:** Integración con `recharts` para visualizar tendencias de ventas, productos más vendidos, y distribución de canales de pago o despacho.
* **Gestión de Estado Global Avanzada:** Utilización de **Zustand** con el middleware de persistencia (`localStorage`) para asegurar que la información (órdenes, carrito y métricas) persista sin necesidad de un backend real.
* **Diseño Premium Moderno:** Interfaz creada con **Tailwind CSS**, aplicando técnicas de *Glassmorphism*, transiciones suaves y soporte completo para temas Oscuro/Claro (Dark & Light mode).
* **Impresión Térmica Simulada:** Generación de tickets de venta y comandas de cocina listos para enviar al spooler de una impresora térmica de 80mm.

## 🛠️ Stack Tecnológico

* **Core:** React 18, TypeScript, Vite
* **Estado:** Zustand
* **Estilos:** Tailwind CSS, Lucide React (Iconografía)
* **Gráficos:** Recharts
* **Ruteo:** React Router DOM

## 🚀 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ChristopherRivera/sushi_store_demo.git
   cd pos_showcase_react
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   El proyecto estará disponible en `http://localhost:5173`.

## 🧪 Pruebas (Testing)
*(Próximamente)* El proyecto incluirá pruebas unitarias y de integración utilizando **Vitest** y **React Testing Library** para asegurar el correcto cálculo del carrito y el renderizado condicional.

---
**Desarrollado por [Christopher Rivera](https://github.com/ChristopherRivera)**  
*Versión Showcase (Demo) de un sistema de Punto de Venta actualmente en producción.*
