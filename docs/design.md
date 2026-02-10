# Diseño Conceptual del Agente de Ventas

## 1. Diagrama de Flujo de Interacción

El siguiente diagrama ilustra cómo fluye la información desde que el usuario envía un mensaje por WhatsApp hasta que recibe una respuesta del Agente con datos reales.

```mermaid
sequenceDiagram
    participant User as Usuario (WhatsApp)
    participant Chatwoot as Chatwoot CRM
    participant Agent as Agente IA (Laburen)
    participant MCP as Backend MCP (Cloudflare Workers)
    participant DB as Base de Datos (D1 SQLite)

    User->>Chatwoot: "Hola, busco pantalones"
    Chatwoot->>Agent: Webhook (Nuevo Mensaje)
    
    Note over Agent: Analiza intención del usuario
    
    Agent->>MCP: POST /products/list { "search": "pantalones" }
    MCP->>DB: SELECT * FROM products WHERE name LIKE '%pantalones%'
    DB-->>MCP: Resultados (JSON)
    MCP-->>Agent: Lista de productos
    
    Agent-->>Chatwoot: "Tengo estos pantalones: ..."
    Chatwoot-->>User: Respuesta en WhatsApp

    User->>Chatwoot: "Quiero el ID 5"
    Chatwoot->>Agent: Webhook
    
    Agent->>MCP: POST /cart/add { "productId": 5, "qty": 1 }
    MCP->>DB: INSERT/UPDATE cart_items
    DB-->>MCP: OK
    MCP-->>Agent: Confirmación
    
    Agent-->>Chatwoot: "Agregado al carrito. ¿Algo más?"
    Chatwoot-->>User: Respuesta en WhatsApp
```

## 2. Definición de Endpoints (MCP)

El Model Context Protocol (MCP) expone una API RESTful optimizada para Agentes (JSON-First, solo POST).

### A. Productos
| Endpoint | Método | Descripción | Body Esperado |
|----------|--------|-------------|---------------|
| `/products/list` | POST | Busca productos por nombre/descripción. | `{ "search": "string" }` |
| `/products/get` | POST | Obtiene detalle de un producto. | `{ "productId": "string" }` |

### B. Carrito de Compras
| Endpoint | Método | Descripción | Body Esperado |
|----------|--------|-------------|---------------|
| `/cart` | POST | Crea un nuevo carrito vacío. | `{}` |
| `/cart/add` | POST | Agrega ítems o suma cantidad. | `{ "cartId": number, "productId": number, "qty": number }` |
| `/cart/update` | POST | Edita cantidad exacta o elimina (qty=0). | `{ "cartId": number, "productId": number, "qty": number }` |
| `/cart/get` | POST | Obtiene contenido total y precios. | `{ "cartId": number }` |

## 3. Modelo de Datos (Esquema)

La persistencia se maneja en **Cloudflare D1** (SQLite distribuido).

### Tabla `products`
*   Catálogo maestro de productos importado desde Excel.
*   Campos: `id`, `name`, `description`, `price`, `stock`.

### Tabla `carts`
*   Representa una sesión de compra.
*   Campos: `id`, `status` (active/closed), `created_at`.

### Tabla `cart_items`
*   Relación muchos a muchos entre carritos y productos.
*   Campos: `id`, `cart_id`, `product_id`, `qty`, `unit_price`.
