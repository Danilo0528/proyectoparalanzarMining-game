# Graph Report - proyectoparalanzar  (2026-11-07)

## Corpus Check
- 111 files · ~41,576 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 2)

## Summary
- 969 nodes · 1727 edges · 74 communities (44 shown, 30 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ff66e092`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- verifyToken
- hooks/use-toast.ts
- 🎮 Melqo - Juego MVP con Pagos Reales
- sidebar.tsx
- 🚀 Guía de Lanzamiento a Producción
- 💰 Sistema de Depósitos con Acreditación Inmediata
- cn
- 🎮 MELQO MVP - RESUMEN EJECUTIVO
- 🎉 NUEVAS FUNCIONALIDADES IMPLEMENTADAS
- 💰 Sistema de Pagos Manuales - Guía Completa
- navigation-menu.tsx
- 🎮 Melqo - MVP Launch Ready!
- dependencies
- field.tsx
- command.tsx
- package.json
- devDependencies
- compilerOptions
- components.json
- form.tsx
- menubar.tsx
- context-menu.tsx
- dropdown-menu.tsx
- Find Skills
- carousel.tsx
- item.tsx
- sheet.tsx
- alert-dialog.tsx
- chart.tsx
- drawer.tsx
- utils.ts
- select.tsx
- services
- breadcrumb.tsx
- pagination.tsx
- next-themes
- lucide-react
- empty.tsx
- payment-api.ts
- scripts
- verify
- collapsible.tsx
- accordion.tsx
- calendar.tsx
- input-otp.tsx
- popover.tsx
- @radix-ui/react-aspect-ratio
- resizable.tsx
- next.config.mjs
- postcss.config.mjs
- clsx
- date-fns@4.1.0
- embla-carousel-react
- @hookform/resolvers@^3.9.1
- input-otp
- @radix-ui/react-accordion
- @radix-ui/react-checkbox
- @radix-ui/react-hover-card
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-switch
- @radix-ui/react-toggle
- react-day-picker
- react-resizable-panels
- recharts
- tailwind-merge
- @types/bcryptjs@^2.4.6
- vaul
- zod@^3.24.1
- start.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 277 edges
2. `react` - 61 edges
3. `Button()` - 32 edges
4. `verifyToken()` - 22 edges
5. `lucide-react` - 22 edges
6. `next` - 19 edges
7. `compilerOptions` - 16 edges
8. `Input()` - 15 edges
9. `class-variance-authority` - 15 edges
10. `🎮 Melqo - Juego MVP con Pagos Reales` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (74 total, 30 thin omitted)

### Community 0 - "react"
Cohesion: 0.07
Nodes (49): Home(), AdminDashboard(), AdminDashboardProps, DepositRequest, EconomyTab(), StatCard(), UserData, WithdrawalRequest (+41 more)

### Community 1 - "verifyToken"
Cohesion: 0.06
Nodes (33): POST(), GET(), POST(), GET(), POST(), GET(), POST(), mapMethodToCurrency() (+25 more)

### Community 2 - "hooks/use-toast.ts"
Cohesion: 0.08
Nodes (40): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+32 more)

### Community 3 - "🎮 Melqo - Juego MVP con Pagos Reales"
Cohesion: 0.05
Nodes (37): 1. El servidor ya está corriendo, 2. Crear tu primera cuenta de Administrador, 3. Iniciar Sesión, Admin:, Bonos:, Colección: `economy_config`, Colección: `users`, Colección: `withdrawals` (+29 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.09
Nodes (31): SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+23 more)

### Community 5 - "🚀 Guía de Lanzamiento a Producción"
Cohesion: 0.06
Nodes (34): 1. Build de Producción ✅, 2. Seguridad ✅, 3. Base de Datos ✅, 🔒 Checklist de Seguridad ANTES de lanzar, ✅ Completado:, Con PM2:, ⚠️ DEBES HACER ANTES DE LANZAR:, 📈 Después del Lanzamiento (+26 more)

### Community 6 - "💰 Sistema de Depósitos con Acreditación Inmediata"
Cohesion: 0.06
Nodes (33): 📋 CHECKLIST PARA CADA DEPÓSITO, Cuando ves un depósito pendiente:, ¿Cómo explico al usuario si rechazo su depósito?, 🔍 CÓMO VERIFICAR DEPÓSITOS, 🎯 EJEMPLO PRÁCTICO, ¿El usuario sabe que estoy verificando?, Escenario 1: Depósito Legítimo, Escenario 2: Usuario se Equivoca de Monto (+25 more)

### Community 7 - "cn"
Cohesion: 0.11
Nodes (27): Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+19 more)

### Community 8 - "🎮 MELQO MVP - RESUMEN EJECUTIVO"
Cohesion: 0.07
Nodes (28): 📁 ARCHIVOS IMPORTANTES, ⚡ COMANDOS RÁPIDOS, Configuración:, Configuración actual:, 🔑 CREDENCIALES DE ADMIN, ¿Cómo ganan dinero los usuarios?, Debes hacer:, Documentación: (+20 more)

### Community 9 - "🎉 NUEVAS FUNCIONALIDADES IMPLEMENTADAS"
Cohesion: 0.07
Nodes (27): 1️⃣ 💼 CONFIGURACIÓN DE BILLETERAS CRYPTO, 2️⃣ ⛏️ MINER MÍNIMO GLOBAL CONFIGURABLE, 3️⃣ 💰 RETIRO MÍNIMO CONFIGURABLE, Antes de compartir con usuarios:, Billeteras disponibles:, 📋 CHECKLIST FINAL, Configuración:, Configuración: (+19 more)

### Community 10 - "💰 Sistema de Pagos Manuales - Guía Completa"
Cohesion: 0.07
Nodes (27): Antes de Aprobar:, Antes de aprobar, revisa:, 📋 CHECKLIST PARA CADA RETIRO, ✅ CONFIGURACIÓN ACTUAL, 📞 CONTACTO CON USUARIOS, Después de Aprobar:, Desventajas:, 🎯 EJEMPLO PRÁCTICO (+19 more)

### Community 11 - "navigation-menu.tsx"
Cohesion: 0.10
Nodes (22): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, NavigationMenu(), NavigationMenuContent() (+14 more)

### Community 12 - "🎮 Melqo - MVP Launch Ready!"
Cohesion: 0.07
Nodes (26): 1. Start the Development Server, 2. Create Admin Account, 3. Configure FaucetPay (Optional), 4. Test the Full Flow, Admin Approves Withdrawal:, 👨‍💼 Admin Dashboard, Admin Rejects Withdrawal:, 🛡️ Anti-Fraud Features (+18 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, lucide-react@^0.564.0, next@16.2.0, @radix-ui/react-avatar@1.1.11, @radix-ui/react-context-menu@2.2.16, @radix-ui/react-dialog@1.1.15, @radix-ui/react-radio-group@1.3.8, @radix-ui/react-scroll-area@1.2.10 (+18 more)

### Community 14 - "field.tsx"
Cohesion: 0.12
Nodes (19): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription(), FieldError() (+11 more)

### Community 15 - "command.tsx"
Cohesion: 0.16
Nodes (16): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+8 more)

### Community 16 - "package.json"
Cohesion: 0.10
Nodes (19): autoprefixer@^10.4.20, cmdk@1.1.1, @radix-ui/react-alert-dialog@1.1.15, @radix-ui/react-dropdown-menu@2.1.16, @radix-ui/react-tabs@1.1.13, @radix-ui/react-toggle-group@1.1.11, react-dom@19.2.4, react-hook-form@^7.54.1 (+11 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, husky@^9.1.7, postcss@^8.5, tailwindcss@^4.2.0, @tailwindcss/postcss@^4.2.0, tw-animate-css@1.3.3, @types/node@^22, @types/react@19.2.14 (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 19 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 20 - "form.tsx"
Cohesion: 0.17
Nodes (14): FieldLabel(), FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+6 more)

### Community 21 - "menubar.tsx"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 22 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 23 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 24 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 25 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 26 - "item.tsx"
Cohesion: 0.20
Nodes (11): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+3 more)

### Community 27 - "sheet.tsx"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 28 - "alert-dialog.tsx"
Cohesion: 0.22
Nodes (8): AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogPortal(), AlertDialogTitle()

### Community 29 - "chart.tsx"
Cohesion: 0.27
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 30 - "drawer.tsx"
Cohesion: 0.22
Nodes (7): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle()

### Community 31 - "utils.ts"
Cohesion: 0.18
Nodes (4): HoverCardContent(), Progress(), Slider(), Switch()

### Community 32 - "select.tsx"
Cohesion: 0.22
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 33 - "services"
Cohesion: 0.18
Nodes (10): key, sync, value, services, buildCommand, env, envVars, name (+2 more)

### Community 34 - "breadcrumb.tsx"
Cohesion: 0.20
Nodes (8): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), @radix-ui/react-slot@1.2.4, @radix-ui/react-slot

### Community 35 - "pagination.tsx"
Cohesion: 0.28
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 36 - "next-themes"
Cohesion: 0.25
Nodes (4): next-themes@^0.4.6, sonner@^1.7.1, next-themes, sonner

### Community 37 - "lucide-react"
Cohesion: 0.25
Nodes (5): Checkbox(), RadioGroup(), RadioGroupItem(), Spinner(), lucide-react

### Community 38 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 40 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, dev:fast, lint, prepare, start

### Community 41 - "verify"
Cohesion: 0.33
Nodes (3): http, makeRequest(), verify()

### Community 43 - "accordion.tsx"
Cohesion: 0.40
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 44 - "calendar.tsx"
Cohesion: 0.60
Nodes (4): AlertDialogAction(), buttonVariants, Calendar(), CalendarDayButton()

### Community 45 - "input-otp.tsx"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

## Knowledge Gaps
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `react`, `hooks/use-toast.ts`, `sidebar.tsx`, `navigation-menu.tsx`, `field.tsx`, `command.tsx`, `form.tsx`, `menubar.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `item.tsx`, `sheet.tsx`, `alert-dialog.tsx`, `chart.tsx`, `drawer.tsx`, `utils.ts`, `select.tsx`, `breadcrumb.tsx`, `pagination.tsx`, `lucide-react`, `empty.tsx`, `accordion.tsx`, `calendar.tsx`, `input-otp.tsx`, `popover.tsx`, `resizable.tsx`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07459207459207459 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `hooks/use-toast.ts`, `sidebar.tsx`, `cn`, `navigation-menu.tsx`, `dependencies`, `field.tsx`, `command.tsx`, `package.json`, `form.tsx`, `menubar.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `item.tsx`, `sheet.tsx`, `alert-dialog.tsx`, `chart.tsx`, `drawer.tsx`, `utils.ts`, `select.tsx`, `breadcrumb.tsx`, `pagination.tsx`, `next-themes`, `lucide-react`, `accordion.tsx`, `calendar.tsx`, `input-otp.tsx`, `popover.tsx`, `resizable.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `verifyToken` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Why does `next` connect `verifyToken` to `react`, `package.json`, `dependencies`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07676767676767676 - nodes in this community are weakly interconnected._
- **Should `🎮 Melqo - Juego MVP con Pagos Reales` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._