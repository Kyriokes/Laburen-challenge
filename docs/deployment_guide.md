# Guía de Despliegue e Integración

## 1. Despliegue del Backend (Cloudflare)
Antes de conectar nada, tu API debe estar pública en Internet.

1.  **Login**: Ejecuta `npx wrangler login` y autoriza en el navegador.
2.  **Deploy**: Ejecuta `npm run deploy`.
3.  **Resultado**: Obtendrás una URL como `https://laburen-challenge.kyriokes.workers.dev`.
    *   ¡Guarda esta URL! La necesitarás para configurar el agente en Laburen.

## 2. Conexión WhatsApp (Twilio) -> Chatwoot
El objetivo es que los mensajes de WhatsApp lleguen a Chatwoot, y Chatwoot se los pase a tu Agente.

### A. Configurar Twilio
1.  Crea cuenta en [Twilio](https://www.twilio.com/).
2.  Compra un número de teléfono con capacidad de **WhatsApp** (o activa el Sandbox para pruebas gratis).
3.  Obtén tu `Account SID` y `Auth Token`.

### B. Configurar Chatwoot
1.  Ve a `https://chatwootchallenge.laburen.com/`.
2.  Loguéate con las credenciales que te enviaron por email.
3.  Ve a **Settings -> Inboxes -> Add Inbox**.
4.  Selecciona **"WhatsApp"** (o "API Channel" si usas una integración custom, pero WhatsApp es más directo).
5.  Rellena los datos de Twilio (SID, Token, Número).
6.  **Callback URL**: Chatwoot te dará una URL. Ve a la consola de Twilio y pégala en la configuración del número ("When a message comes in").

### C. Conectar Chatwoot a Laburen (Platform)
1.  En la plataforma de Laburen, ve a la configuración de tu Agente.
2.  Busca la sección "Integrations" o "CRM".
3.  Ingresa:
    *   **Chatwoot Server URL**: `https://chatwootchallenge.laburen.com/`
    *   **Platform App Token**: `7YRVVb8JzvDG8yfaVkZAQ48j` (Dato del challenge).
    *   **Inbox Token**: El token del inbox que creaste en el paso B.

## 3. Verificación Final
1.  Envía un "Hola" desde tu WhatsApp real al número de Twilio.
2.  Debería aparecer en Chatwoot.
3.  El Agente (si está encendido en Laburen) debería leerlo, "pensar" y responderte por WhatsApp.
