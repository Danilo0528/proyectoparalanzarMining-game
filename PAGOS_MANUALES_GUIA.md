# 💰 Sistema de Pagos Manuales - Guía Completa

## ✅ CONFIGURACIÓN ACTUAL

**TODOS los pagos y retiros deben ser verificados manualmente por el administrador.**

No hay pagos automáticos. Tú controlas cada transacción personalmente.

---

## 🔄 FLUJO COMPLETO DE RETIRO

### Paso 1: Usuario Solicita Retiro
```
Usuario → FINANCE tab → Selecciona método → Ingresa cantidad y dirección → Submit
```

**Lo que sucede:**
- Balance del usuario se descuenta INMEDIATAMENTE
- Solicitud se guarda en MongoDB con estado: **PENDING**
- Aparece en tu Admin Dashboard

---

### Paso 2: Admin Revisa la Solicitud
```
Admin Dashboard → WITHDRAWALS tab → Ves la solicitud pendiente
```

**Información que ves:**
- 👤 Email del usuario
- 💰 Cantidad de monedas
- 💳 Método de pago (Bitcoin, DOGE, USDT, etc.)
- 📍 Dirección de wallet del usuario
- 📅 Fecha de solicitud

**Verificación que debes hacer:**
1. ¿El usuario tiene actividad legítima?
2. ¿No hay señales de fraude?
3. ¿La cantidad es razonable?

---

### Paso 3: Admin Decide

#### OPCIÓN A: APROBAR ✅
```
Click en "Approve" → Estado cambia a APPROVED
```

**Lo que sucede:**
- Estado cambia a: **APPROVED**
- Payment status: **PENDING_PAYMENT** ⏳
- Ahora DEBES enviar el pago manualmente

**Tus acciones ahora:**
1. Abre tu wallet de crypto (ej: Binance, MetaMask, etc.)
2. Envía la cantidad exacta a la dirección del usuario
3. Guarda el transaction hash (txHash)
4. Vuelve al Admin Dashboard
5. Click en **"Mark as Paid"**
6. Ingresa el txHash (opcional pero recomendado)
7. Estado final: **COMPLETED** ✅

---

#### OPCIÓN B: RECHAZAR ❌
```
Click en "Reject" → Balance se reembolsa automáticamente
```

**Lo que sucede:**
- Estado cambia a: **REJECTED**
- Balance se devuelve al usuario AUTOMÁTICAMENTE
- Usuario puede ver el rechazo en su historial

---

## 📊 ESTADOS DEL RETIRO

| Estado | Payment Status | Significado |
|--------|----------------|-------------|
| 🟡 **PENDING** | - | Esperando tu aprobación |
| 🔵 **APPROVED** | ⏳ PENDING_PAYMENT | Aprobado, debes enviar pago |
| 🟢 **COMPLETED** | ✅ PAID | Pago enviado manualmente |
| 🔴 **REJECTED** | - | Rechazado, balance reembolsado |

---

## 🎯 EJEMPLO PRÁCTICO

### Escenario:
Usuario `juan@email.com` solicita retirar **2000 monedas** vía **BITCOIN**

### Tu proceso:

**1. Ves la solicitud en Admin Dashboard:**
```
User: juan@email.com
Amount: 2,000 coins
Method: BITCOIN
Address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
Date: 2026-04-07
Status: PENDING
```

**2. Calculas el monto a enviar:**
```
2000 coins ÷ 2000 = $1 USD
$1 USD en BTC = ~0.000015 BTC (dependiendo del precio actual)
```

**3. Verificas la actividad del usuario:**
- Revisas su historial en la tabla de usuarios
- Verificas que no tenga actividad sospechosa
- Todo se ve bien ✅

**4. Apruebas el retiro:**
```
Click "Approve"
Estado → APPROVED
Payment Status → PENDING_PAYMENT
```

**5. Envías el pago manualmente:**
- Abres tu wallet de Bitcoin
- Envías 0.000015 BTC a: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
- Guardas el txHash: `a1b2c3d4e5f6...`

**6. Marcas como pagado:**
```
Click "Mark as Paid"
Ingresa txHash: a1b2c3d4e5f6...
Estado → COMPLETED ✅
Payment Status → PAID ✅
```

---

## 💡 MÉTODOS DE PAGO Y CÁLCULOS

### Tasa de conversión:
```
2000 monedas = $1 USD
```

### Montos comunes:

| Monedas | USD Equivalente |
|---------|-----------------|
| 50 | $0.025 |
| 100 | $0.05 |
| 500 | $0.25 |
| 1000 | $0.50 |
| 2000 | $1.00 |
| 5000 | $2.50 |
| 10000 | $5.00 |

### Métodos de pago disponibles:
- **Bitcoin (BTC)** - Envía satoshis o BTC
- **Ethereum (ETH)** - Envía wei o ETH
- **Dogecoin (DOGE)** - Envía DOGE
- **Litecoin (LTC)** - Envía LTC
- **Tron (TRX)** - Envía TRX
- **Toncoin (TON)** - Envía TON
- **USDT TRC20** - Envía USDT en red Tron
- **USDT BEP20** - Envía USDT en red BSC
- **Binance BEP20** - Envía en red BSC

---

## 🔍 VERIFICACIÓN DE SEGURIDAD

### Antes de aprobar, revisa:

**1. Actividad del usuario:**
```
Admin Dashboard → USERS tab
Busca al usuario por email
Revisa su balance y actividad
```

**2. Señales de alerta:**
- 🚩 Usuario marcado como "Flagged"
- 📈 Balance aumentó sospechosamente rápido
- ⏰ Cuenta muy nueva con balance muy alto
- 🔄 Múltiples retiros en poco tiempo

**3. Si algo parece sospechoso:**
- Rechaza el retiro
- El balance se devuelve al usuario
- Investiga más antes de aprobar otro intento

---

## 📋 CHECKLIST PARA CADA RETIRO

### Antes de Aprobar:
- [ ] Revisar email del usuario
- [ ] Verificar cantidad de monedas
- [ ] Comprobar método de pago
- [ ] Confirmar dirección de wallet
- [ ] Revisar historial del usuario
- [ ] Verificar que no esté flagged
- [ ] Comprobar que la cantidad sea razonable

### Después de Aprobar:
- [ ] Calcular monto en crypto a enviar
- [ ] Abrir tu wallet
- [ ] Enviar pago a dirección correcta
- [ ] Guardar transaction hash
- [ ] Volver al Admin Dashboard
- [ ] Click "Mark as Paid"
- [ ] Ingresar txHash
- [ ] Confirmar que estado es COMPLETED

---

## ⚠️ IMPORTANTE

### Ventajas de Pagos Manuales:
✅ **Control total** - Tú decides cada pago
✅ **Verificación de seguridad** - Puedes detectar fraude
✅ **Sin dependencia de APIs** - No necesitas FaucetPay
✅ **Flexibilidad** - Puedes contactar al usuario si hay problemas

### Desventajas:
⚠️ **Requiere tu tiempo** - Debes revisar y aprobar cada retiro
⚠️ **No es instantáneo** - Usuario debe esperar tu aprobación
⚠️ **Debes tener fondos** - Necesitas crypto en tu wallet para enviar

### Recomendaciones:
1. **Revisa retiros al menos 1-2 veces al día**
2. **Mén siempre crypto en tus wallets**
3. **Guarda todos los txHash como comprobante**
4. **Comunícate con usuarios si hay problemas**
5. **Sé transparente sobre tiempos de procesamiento**

---

## 🎯 RESUMEN RÁPIDO

```
1. Usuario solicita retiro → PENDING
2. Tú revisas y apruebas → APPROVED + PENDING_PAYMENT
3. Envías pago manualmente desde tu wallet
4. Marcas como pagado → COMPLETED + PAID
5. ✅ Proceso terminado
```

**O si rechazas:**
```
1. Usuario solicita retiro → PENDING
2. Tú rechazas → REJECTED
3. Balance se devuelve automáticamente
4. ❌ Proceso terminado
```

---

## 📞 CONTACTO CON USUARIOS

Si tienes problemas con un retiro:
1. Revisa el email del usuario en la solicitud
2. Contacta explicando el problema
3. Si necesitas más información, pídesela
4. Una vez resuelto, completa el proceso

---

**¡Este sistema te da control total sobre cada pago!** 🔒💰
