# 🚀 Guía de Lanzamiento a Producción

## ✅ Pre-Lanzamiento: Checklist Completo

### 1. Build de Producción ✅
- El build se compiló exitosamente
- Todas las rutas están configuradas
- No hay errores de TypeScript

### 2. Seguridad ✅
- JWT_SECRET seguro generado
- Contraseñas encriptadas con bcrypt
- Tokens de autenticación en todas las APIs
- Validación de datos en endpoints

### 3. Base de Datos ✅
- MongoDB Atlas configurado y conectado
- Colecciones creadas: users, withdrawals, economy_config
- Admin user creado: admin@melqo.com

---

## 🎯 Opciones de Lanzamiento

### OPCIÓN A: Lanzar en tu PC Local (Rápido)

**Ideal para:**
- Pruebas con usuarios reales
- Demostraciones
- Uso en red local

**Pasos:**

1. **Asegúrate de que el puerto 3000 esté accesible:**
```bash
# Verificar que el servidor está corriendo
curl http://localhost:3000
```

2. **Obtener tu IP local:**
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```
Tu IP será algo como: `192.168.18.90`

3. **Comparte la IP con tus usuarios:**
```
http://192.168.18.90:3000
```

4. **Mantén el servidor corriendo:**
```bash
npm run build
npm start
```

**⚠️ Limitaciones:**
- Solo accesible en tu red local
- Tu PC debe estar encendida 24/7
- No es escalable para muchos usuarios

---

### OPCIÓN B: Lanzar en VPS (Recomendado para producción real)

**Ideal para:**
- Acceso público desde internet
- Múltiples usuarios
- Servicio 24/7
- Escalabilidad

#### Paso 1: Contratar un VPS

**Opciones económicas:**
- **DigitalOcean**: $6/mes (https://digitalocean.com)
- **Vultr**: $6/mes (https://vultr.com)
- **Linode**: $5/mes (https://linode.com)
- **Railway**: Gratis con límites (https://railway.app)
- **Render**: Gratis con límites (https://render.com)

**Requisitos mínimos:**
- 2GB RAM
- 2 CPUs
- 50GB SSD
- Ubuntu 22.04

#### Paso 2: Configurar el VPS

```bash
# Conectar al VPS por SSH
ssh root@TU_IP_VPS

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PM2 (process manager)
npm install -g pm2

# Instalar Nginx
apt install -y nginx
```

#### Paso 3: Subir tu proyecto

**Opción A - Usando Git:**
```bash
# En tu PC local, subir a GitHub
cd /home/kirito/Documentos/proyectoparalanzar
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/melqo.git
git push -u origin main

# En el VPS, clonar el repo
cd /var/www
git clone https://github.com/tu-usuario/melqo.git
cd melqo
```

**Opción B - Usando SCP:**
```bash
# En tu PC local
scp -r /home/kirito/Documentos/proyectoparalanzar root@TU_IP_VPS:/var/www/melqo
```

#### Paso 4: Configurar variables de entorno en VPS

```bash
# En el VPS
cd /var/www/melqo
nano .env.production
```

Pegar:
```env
MONGODB_URI="mongodb+srv://naofumiiwatana46_db_user:ThI1m8hqmSd3TVLj@globingminer.qgvn8z2.mongodb.net/Globingminer?retryWrites=true&w=majority"
JWT_SECRET="30baf8d9a9cfcb51c935e6e8aa6d62ed10689375712380e6f4efd064ed5c0c6b20de77508a0720ba85b9b17dc3c32a732a1b40341e7ceec760884c97d176112e"
FAUCETPAY_API_KEY=""
NODE_ENV="production"
```

#### Paso 5: Instalar dependencias y build

```bash
cd /var/www/melqo
npm install --production
npm run build
```

#### Paso 6: Configurar PM2

```bash
# Crear archivo de configuración de PM2
nano ecosystem.config.js
```

Pegar:
```javascript
module.exports = {
  apps: [{
    name: 'melqo',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/melqo-error.log',
    out_file: '/var/log/melqo-out.log',
    log_file: '/var/log/melqo-combined.log'
  }]
}
```

```bash
# Iniciar con PM2
pm2 start ecosystem.config.js

# Guardar configuración para reinicio automático
pm2 save
pm2 startup
```

#### Paso 7: Configurar Nginx (Reverse Proxy)

```bash
nano /etc/nginx/sites-available/melqo
```

Pegar:
```nginx
server {
    listen 80;
    server_name TU_DOMINIO_O_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar el sitio
ln -s /etc/nginx/sites-available/melqo /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Paso 8: Configurar SSL (HTTPS) - Opcional pero recomendado

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d TU_DOMINIO
```

---

### OPCIÓN C: Desplegar en Vercel (Más fácil, gratis)

**Ideal para:**
- Despliegue rápido sin configurar servidores
- HTTPS automático
- CDN global
- Gratis para proyectos pequeños

**Pasos:**

1. **Subir tu código a GitHub:**
```bash
cd /home/kirito/Documentos/proyectoparalanzar
git init
git add .
git commit -m "Melqo MVP"
git remote add origin https://github.com/tu-usuario/melqo.git
git push -u origin main
```

2. **Ir a Vercel:**
   - https://vercel.com
   - Click "New Project"
   - Importar tu repo de GitHub

3. **Configurar variables de entorno en Vercel:**
   - Ir a Settings → Environment Variables
   - Agregar:
     ```
     MONGODB_URI=mongodb+srv://naofumiiwatana46_db_user:ThI1m8hqmSd3TVLj@globingminer.qgvn8z2.mongodb.net/Globingminer?retryWrites=true&w=majority
     JWT_SECRET=30baf8d9a9cfcb51c935e6e8aa6d62ed10689375712380e6f4efd064ed5c0c6b20de77508a0720ba85b9b17dc3c32a732a1b40341e7ceec760884c97d176112e
     FAUCETPAY_API_KEY=(tu API key si la tienes)
     ```

4. **Deploy:**
   - Click "Deploy"
   - Esperar 2-3 minutos
   - ¡Listo! Tu app estará en https://melqo.vercel.app

---

## 🔒 Checklist de Seguridad ANTES de lanzar

### ✅ Completado:
- [x] JWT_SECRET seguro y único
- [x] Contraseñas encriptadas con bcrypt
- [x] Validación en todas las APIs
- [x] Tokens de autenticación
- [x] Sistema anti-fraude

### ⚠️ DEBES HACER ANTES DE LANZAR:

1. **Cambiar la contraseña del admin por defecto:**
```bash
# Crear un nuevo admin con tu email y contraseña segura
node scripts/create-admin.js tu-email@real.com tu-contraseña-segura
```

2. **Si vas a usar FaucetPay, agregar la API key:**
```bash
# Editar .env.production
FAUCETPAY_API_KEY="tu-api-key-aqui"
```

3. **Eliminar credenciales de prueba del código:**
   - No hardcodear contraseñas
   - No compartir .env.local en Git

4. **Configurar .gitignore correcto:**
```bash
# Verificar que .gitignore incluya:
node_modules/
.next/
.env.local
.env.production
*.log
```

---

## 📊 Monitoreo

### Con PM2:
```bash
# Ver logs en tiempo real
pm2 logs melqo

# Ver estado
pm2 status

# Ver métricas
pm2 monit

# Reiniciar
pm2 restart melqo

# Detener
pm2 stop melqo
```

### MongoDB:
- Usar MongoDB Compass para ver la base de datos
- Monitorear colección `users` para actividad sospechosa
- Revisar `withdrawals` diariamente

---

## 🎯 Lanzamiento Rápido (Tu PC Local - AHORA)

Si quieres lanzar **AHORA MISMO** para que tus usuarios prueben:

```bash
# 1. Asegúrate de que el build esté hecho
npm run build

# 2. Iniciar en modo producción
npm start

# 3. Obtener tu IP
hostname -I | awk '{print $1}'

# 4. Compartir la URL
# http://TU_IP:3000
```

**Tu IP actual es:** `192.168.18.90`

**URL para compartir:** `http://192.168.18.90:3000`

⚠️ **Importante:**
- Tu firewall debe permitir el puerto 3000
- Tu PC debe estar encendida
- Solo funciona en tu red local

---

## 📈 Después del Lanzamiento

### Diario:
1. Revisar el admin dashboard
2. Aprobar retiros pendientes
3. Verificar usuarios marcados como sospechosos
4. Revisar logs de errores

### Semanal:
1. Hacer backup de MongoDB
2. Revisar métricas de uso
3. Ajustar economía si es necesario
4. Actualizar dependencias

### Mensual:
1. Revisar y rotar JWT_SECRET
2. Auditar transacciones
3. Optimizar rendimiento
4. Planear nuevas features

---

## 🆘 Solución de Problemas

### El servidor no inicia:
```bash
# Ver logs
npm start 2>&1 | tee start.log

# Verificar puerto
lsof -i :3000

# Matar procesos viejos
pkill -f "next start"
npm start
```

### MongoDB no conecta:
```bash
# Verificar URI en .env.production
cat .env.production | grep MONGODB

# Probar conexión
node -e "require('mongodb').MongoClient.connect(process.env.MONGODB_URI).then(() => console.log('OK'))"
```

### Usuarios no pueden registrarse:
```bash
# Ver logs del servidor
pm2 logs melqo

# Probar API directamente
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","action":"register"}'
```

---

## 🎉 ¡Estás Listo para Lanzar!

**Recomendación:**
- **Para pruebas iniciales**: Usa tu PC local (Opción A)
- **Para producción real**: Usa VPS o Vercel (Opción B o C)

**URLs de acceso:**
- Local: http://192.168.18.90:3000
- VPS: http://TU_IP_VPS o https://tu-dominio.com
- Vercel: https://melqo.vercel.app

**Admin credentials:**
- Email: admin@melqo.com (cambiar por el tuyo)
- Password: admin123 (cambiar inmediatamente)

---

## 📞 Soporte Post-Lanzamiento

Si algo falla:
1. Revisar logs: `pm2 logs melqo`
2. Verificar MongoDB: https://cloud.mongodb.com
3. Revisar admin dashboard para retiros pendientes
4. Ajustar economía desde el panel de admin

**¡Buena suerte con el lanzamiento! 🚀**
