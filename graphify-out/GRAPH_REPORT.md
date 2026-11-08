# Graph Report - proyectoparalanzar  (2026-11-07)

## Corpus Check
- 180 files · ~199,365 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 37, (none) 2, .css 2)

## Summary
- 1695 nodes · 3233 edges · 103 communities (71 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cc5f749a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
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
- validate_data.py
- dropdown-menu.tsx
- Find Skills
- carousel.tsx
- BM25
- design_system.py
- alert-dialog.tsx
- chart.tsx
- drawer.tsx
- hover-card.tsx
- select.tsx
- services
- breadcrumb.tsx
- react
- next-themes
- core.py
- empty.tsx
- payment-api.ts
- scripts
- mongodb
- collapsible.tsx
- search_stack
- search
- game-dashboard.tsx
- popover.tsx
- @radix-ui/react-aspect-ratio
- pathlib
- next.config.mjs
- postcss.config.mjs
- miners-tab.tsx
- Codebase Design
- embla-carousel-react
- csv
- test_design_system_mode.py
- HTML Report Format
- @radix-ui/react-checkbox
- format_ascii_box
- test_data_contracts.py
- @radix-ui/react-navigation-menu
- UI/UX Pro Max - Design Intelligence
- read_rows
- finance-tab.tsx
- DesignSystemGenerator
- _palette_is_dark
- Diagnosing Bugs
- CatalogRefreshTest
- tailwind-merge
- top-bar.tsx
- Test-Driven Development
- zod@^3.24.1
- start.sh
- Pre-Delivery Checklist (canonical — the only one)
- Quick Reference
- bonus-tab.tsx
- .generate
- input-group.tsx
- navigation-menu.tsx
- _select_palette_for_mode
- TestThresholdGate
- interface
- CatalogSummaryLineEndingsTest
- split_values
- TestStackFlagWithDesignSystem
- RtlCliTest
- interface
- interface
- interface
- hitl-loop.template.sh
- interface
- TestFixtureValidation
- jsonwebtoken
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-toast
- react-dom@19.2.4
- @vercel/analytics

## God Nodes (most connected - your core abstractions)
1. `cn()` - 294 edges
2. `react` - 64 edges
3. `search()` - 54 edges
4. `DesignSystemGenerator` - 38 edges
5. `search_stack()` - 36 edges
6. `Button()` - 32 edges
7. `lucide-react` - 30 edges
8. `verifyToken()` - 22 edges
9. `next` - 19 edges
10. `BM25` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Interaction (App)` --references--> `Button()`  [INFERRED]
  .agents/skills/ui-ux-pro-max/references/pro-rules.md → components/ui/button.tsx
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogTitle()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogDescription()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (103 total, 32 thin omitted)

### Community 0 - "Button"
Cohesion: 0.19
Nodes (17): AdminDashboard(), AdminDashboardProps, DepositRequest, EconomyTab(), StatCard(), UserData, WithdrawalRequest, LoginPageProps (+9 more)

### Community 1 - "verifyToken"
Cohesion: 0.07
Nodes (27): POST(), GET(), POST(), GET(), POST(), GET(), POST(), mapMethodToCurrency() (+19 more)

### Community 2 - "hooks/use-toast.ts"
Cohesion: 0.08
Nodes (40): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+32 more)

### Community 3 - "🎮 Melqo - Juego MVP con Pagos Reales"
Cohesion: 0.05
Nodes (37): 1. El servidor ya está corriendo, 2. Crear tu primera cuenta de Administrador, 3. Iniciar Sesión, Admin:, Bonos:, Colección: `economy_config`, Colección: `users`, Colección: `withdrawals` (+29 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.07
Nodes (40): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+32 more)

### Community 5 - "🚀 Guía de Lanzamiento a Producción"
Cohesion: 0.06
Nodes (34): 1. Build de Producción ✅, 2. Seguridad ✅, 3. Base de Datos ✅, 🔒 Checklist de Seguridad ANTES de lanzar, ✅ Completado:, Con PM2:, ⚠️ DEBES HACER ANTES DE LANZAR:, 📈 Después del Lanzamiento (+26 more)

### Community 6 - "💰 Sistema de Depósitos con Acreditación Inmediata"
Cohesion: 0.06
Nodes (33): 📋 CHECKLIST PARA CADA DEPÓSITO, Cuando ves un depósito pendiente:, ¿Cómo explico al usuario si rechazo su depósito?, 🔍 CÓMO VERIFICAR DEPÓSITOS, 🎯 EJEMPLO PRÁCTICO, ¿El usuario sabe que estoy verificando?, Escenario 1: Depósito Legítimo, Escenario 2: Usuario se Equivoca de Monto (+25 more)

### Community 7 - "cn"
Cohesion: 0.05
Nodes (46): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction() (+38 more)

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
Cohesion: 0.16
Nodes (13): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, ToggleGroup(), ToggleGroupContext (+5 more)

### Community 12 - "🎮 Melqo - MVP Launch Ready!"
Cohesion: 0.07
Nodes (26): 1. Start the Development Server, 2. Create Admin Account, 3. Configure FaucetPay (Optional), 4. Test the Full Flow, Admin Approves Withdrawal:, 👨‍💼 Admin Dashboard, Admin Rejects Withdrawal:, 🛡️ Anti-Fraud Features (+18 more)

### Community 13 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, autoprefixer@^10.4.20, clsx@^2.1.1, cmdk@1.1.1, date-fns@4.1.0, @hookform/resolvers@^3.9.1, input-otp@1.4.2, lucide-react@^0.564.0 (+27 more)

### Community 14 - "field.tsx"
Cohesion: 0.08
Nodes (28): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription(), FieldError() (+20 more)

### Community 15 - "command.tsx"
Cohesion: 0.16
Nodes (16): Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+8 more)

### Community 16 - "package.json"
Cohesion: 0.07
Nodes (27): @radix-ui/react-context-menu@2.2.16, @radix-ui/react-label@2.1.8, @radix-ui/react-menubar@1.1.16, @radix-ui/react-radio-group@1.3.8, @radix-ui/react-switch@1.2.6, @radix-ui/react-tabs@1.1.13, @radix-ui/react-toggle@1.1.10, @radix-ui/react-tooltip@1.2.8 (+19 more)

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, husky@^9.1.7, postcss@^8.5, tailwindcss@^4.2.0, @tailwindcss/postcss@^4.2.0, tw-animate-css@1.3.3, @types/node@^22, @types/react@19.2.14 (+15 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 19 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 20 - "form.tsx"
Cohesion: 0.20
Nodes (12): FieldLabel(), FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+4 more)

### Community 21 - "menubar.tsx"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 22 - "validate_data.py"
Cohesion: 0.05
Nodes (51): 1. Pin the fixed point, 2. Identify the spec source, 3. Identify the standards sources, 4. Spawn both sub-agents in parallel, 5. Aggregate, Process, Why two axes, read_rows() (+43 more)

### Community 23 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 24 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 25 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 26 - "BM25"
Cohesion: 0.06
Nodes (17): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _file_signature(), _get_bm25(), _load_csv(), _load_csv_snapshot() (+9 more)

### Community 27 - "design_system.py"
Cohesion: 0.08
Nodes (12): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), _detect_page_type(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+4 more)

### Community 28 - "alert-dialog.tsx"
Cohesion: 0.20
Nodes (9): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogPortal() (+1 more)

### Community 29 - "chart.tsx"
Cohesion: 0.27
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 30 - "drawer.tsx"
Cohesion: 0.22
Nodes (7): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle()

### Community 31 - "hover-card.tsx"
Cohesion: 0.33
Nodes (3): HoverCardContent(), @radix-ui/react-hover-card@1.1.15, @radix-ui/react-hover-card

### Community 32 - "select.tsx"
Cohesion: 0.22
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 33 - "services"
Cohesion: 0.18
Nodes (10): key, sync, value, services, buildCommand, env, envVars, name (+2 more)

### Community 34 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 35 - "react"
Cohesion: 0.10
Nodes (14): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious(), RadioGroup() (+6 more)

### Community 37 - "core.py"
Cohesion: 0.08
Nodes (17): _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _legacy_successor_guidance(), _normalize(), _normalize_rtl_level(), _passes_threshold(), _project_row() (+9 more)

### Community 38 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 40 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:fast, lint, prepare, start, test (+1 more)

### Community 41 - "mongodb"
Cohesion: 0.14
Nodes (9): bcryptjs@^3.0.3, mongodb@^7.1.1, bcryptjs, mongodb, bcrypt, { MongoClient }, http, makeRequest() (+1 more)

### Community 43 - "search_stack"
Cohesion: 0.10
Nodes (5): search_stack(), _rows(), TestNativeDesktopStackFreshness, _rows(), TestWebStackFreshness

### Community 44 - "search"
Cohesion: 0.09
Nodes (5): search(), TestDiagnosticsContracts, TestSearchDomains, RtlFilterTest, TestStyleTaxonomy

### Community 45 - "game-dashboard.tsx"
Cohesion: 0.16
Nodes (26): Home(), GameDashboard(), GameDashboardProps, LoginPage(), MinersTabProps, usePersistentState(), calculateMinerEarnings(), calculateOfflineEarnings() (+18 more)

### Community 46 - "popover.tsx"
Cohesion: 0.29
Nodes (3): PopoverContent(), @radix-ui/react-popover@1.1.15, @radix-ui/react-popover

### Community 48 - "pathlib"
Cohesion: 0.09
Nodes (5): TestImeGuidance, TestMetricMath, resolve(), shipped_invocations(), SkillScriptPathsTest

### Community 52 - "miners-tab.tsx"
Cohesion: 0.17
Nodes (24): ArcadeCard(), CoinAmount(), EmptyState(), ProgressBar(), RARITIES, RarityBadge(), SectionHeading(), StatTile() (+16 more)

### Community 53 - "Codebase Design"
Cohesion: 0.09
Nodes (21): 1. In-process, 2. Local-substitutable, 3. Remote but owned (Ports & Adapters), 4. True external (Mock), Deepening, Dependency categories, Seam discipline, Testing strategy: replace, don't layer (+13 more)

### Community 55 - "csv"
Cohesion: 0.12
Nodes (6): read_rows(), RtlDataContractTest, read_rows(), read_rows(), TestTextLayoutDataContracts, TestTextLayoutRetrieval

### Community 56 - "test_design_system_mode.py"
Cohesion: 0.14
Nodes (6): _filter_anti_patterns_for_mode(), _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary(), TestAntiPatternGating, TestModeResolution

### Community 57 - "HTML Report Format"
Cohesion: 0.10
Nodes (18): Call-graph collapse, Candidate card, Cross-section (good for layered shallowness), Diagram patterns, Hand-built boxes-and-arrows (when Mermaid's layout fights you), Header, HTML Report Format, Mass diagram (good for "interface as wide as implementation") (+10 more)

### Community 59 - "format_ascii_box"
Cohesion: 0.13
Nodes (9): ansi_ljust(), format_ascii_box(), add_wrapped(), wrap_text(), format_markdown(), hex_to_ansi(), _mode_support_labels(), section_header() (+1 more)

### Community 60 - "test_data_contracts.py"
Cohesion: 0.16
Nodes (5): safe_slug(), apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action()

### Community 62 - "UI/UX Pro Max - Design Intelligence"
Cohesion: 0.11
Nodes (17): Before Delivering App UI, Example Workflow, If a search returns 0 results, Output Formats, Query Contract, Rule Categories by Priority, Running the search tool, Step 1: Analyze User Requirements (+9 more)

### Community 63 - "read_rows"
Cohesion: 0.18
Nodes (3): read_rows(), TestLandingAndStackContract, TestReasoningContract

### Community 64 - "finance-tab.tsx"
Cohesion: 0.24
Nodes (14): Field(), FinanceTab(), FinanceTabProps, Method, METHOD_TO_WALLET, Mode, PAYMENT_METHODS, ReadOnlyValue() (+6 more)

### Community 66 - "_palette_is_dark"
Cohesion: 0.17
Nodes (4): _palette_is_dark(), _relative_luminance(), TestEndToEndCoherence, TestLuminance

### Community 67 - "Diagnosing Bugs"
Cohesion: 0.13
Nodes (14): Completion criterion: a tight loop that goes red, Diagnosing Bugs, Minimise, Non-deterministic bugs, Phase 1: Build a feedback loop, Phase 2: Reproduce + minimise, Phase 3: Hypothesise, Phase 4: Instrument (+6 more)

### Community 70 - "top-bar.tsx"
Cohesion: 0.33
Nodes (9): BottomNav(), BottomNavProps, GameShell(), GameShellProps, NAV_ITEMS, NavItem, TopBar(), TopBarProps (+1 more)

### Community 71 - "Test-Driven Development"
Cohesion: 0.15
Nodes (10): Designing for Mockability, When to Mock, Anti-patterns, Rules of the loop, Seams: where tests go, Test-Driven Development, What a good test is, Bad Tests (+2 more)

### Community 74 - "Pre-Delivery Checklist (canonical — the only one)"
Cohesion: 0.15
Nodes (12): Accessibility, Common Rules for Professional UI + Pre-Delivery Checklist, Icons & Visual Elements, Interaction, Interaction (App), Layout, Layout & Spacing, Light/Dark Mode (+4 more)

### Community 75 - "Quick Reference"
Cohesion: 0.15
Nodes (12): 10. Charts & Data (LOW), 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Style Selection (HIGH), 5. Layout & Responsive (HIGH), 6. Typography & Color (MEDIUM), 7. Animation (MEDIUM) (+4 more)

### Community 76 - "bonus-tab.tsx"
Cohesion: 0.28
Nodes (10): BONUS_ICONS, BonusTab(), BonusTabProps, INITIAL_ACHIEVEMENTS, BonusDefinition, BONUSES, BonusStatus, claimBonus() (+2 more)

### Community 78 - "input-group.tsx"
Cohesion: 0.27
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 79 - "navigation-menu.tsx"
Cohesion: 0.24
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 82 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 84 - "split_values"
Cohesion: 0.47
Nodes (3): split_values(), style_identities(), TestStyleIdentityContract

### Community 87 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 88 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 89 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 90 - "hitl-loop.template.sh"
Cohesion: 0.83
Nodes (3): capture(), hitl-loop.template.sh script, step()

### Community 91 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

## Knowledge Gaps
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Button`, `hooks/use-toast.ts`, `sidebar.tsx`, `navigation-menu.tsx`, `field.tsx`, `command.tsx`, `form.tsx`, `menubar.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `drawer.tsx`, `hover-card.tsx`, `select.tsx`, `breadcrumb.tsx`, `react`, `empty.tsx`, `game-dashboard.tsx`, `popover.tsx`, `miners-tab.tsx`, `top-bar.tsx`, `input-group.tsx`, `navigation-menu.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestReasoningMatch` and `TestReasoningContract`) actually correct?**
  _`DesignSystemGenerator` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `verifyToken` be split into smaller, more focused modules?**
  _Cohesion score 0.07127882599580712 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Button`, `hooks/use-toast.ts`, `sidebar.tsx`, `cn`, `navigation-menu.tsx`, `dependencies`, `field.tsx`, `command.tsx`, `package.json`, `form.tsx`, `menubar.tsx`, `dropdown-menu.tsx`, `carousel.tsx`, `alert-dialog.tsx`, `chart.tsx`, `drawer.tsx`, `hover-card.tsx`, `select.tsx`, `breadcrumb.tsx`, `next-themes`, `game-dashboard.tsx`, `popover.tsx`, `miners-tab.tsx`, `finance-tab.tsx`, `top-bar.tsx`, `bonus-tab.tsx`, `navigation-menu.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07676767676767676 - nodes in this community are weakly interconnected._
- **Why does `search()` connect `search` to `core.py`, `.generate`, `pathlib`, `validate_data.py`, `csv`, `BM25`, `design_system.py`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `🎮 Melqo - Juego MVP con Pagos Reales` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._