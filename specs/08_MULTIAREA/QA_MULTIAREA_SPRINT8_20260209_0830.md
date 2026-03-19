# QA Report — Sprint 8: Multi-Area + RBAC

**Data:** 2026-02-09 08:30 UTC-3  
**Script:** `scripts/dev/qa_multiarea_sprint8.ps1`  
**Resultado:** **35 PASS | 0 FAIL | 0 WARN**

---

## 1. Arquivos-Chave

| Arquivo | Status |
|---------|--------|
| `src/shared/config/rbac.ts` | PASS |
| `src/shared/hooks/useRBAC.ts` | PASS |
| `src/features/area-plans/utils/mockData.ts` | PASS |
| `src/features/area-plans/utils/mockActions.ts` | PASS |
| `src/features/strategic-pack/api-mock.ts` | PASS |
| `src/features/closings/api-mock.ts` | PASS |
| `src/shared/config/navigation.ts` | PASS |

## 2. RBAC Config

| Check | Status |
|-------|--------|
| `MULTIAREA_ENABLED = true` | PASS |
| `getAllowedAreas` exportado | PASS |
| `canAccessArea` exportado | PASS |
| `hasFeature` exportado | PASS |
| 5 area slugs em `ALL_AREA_SLUGS` | PASS |

## 3. Seeds — Ações por Área

| Área | Contagem | Min | Status |
|------|----------|-----|--------|
| RH | 59 | 20 | PASS |
| MKT | 25 | 20 | PASS |
| OPS | 27 | 20 | PASS |
| FIN | 21 | 20 | PASS |
| TI | 15 | 4 | PASS |

**Total de ações:** 147

## 4. Strategic Packs

| Pack | Status |
|------|--------|
| `pack-rh-2026` | PASS |
| `pack-mkt-2026` | PASS |
| `pack-ops-2026` | PASS |
| `pack-fin-2026` | PASS |

## 5. Plans vinculados a Packs

| Pack | Plan | Status |
|------|------|--------|
| `pack-mkt-2026` | `plan-mkt-2026` | PASS |
| `pack-ops-2026` | `plan-ops-2026` | PASS |
| `pack-fin-2026` | `plan-fin-2026` | PASS |

## 6. Closings Multiárea

| Área | Seed | Status |
|------|------|--------|
| RH | 3 períodos (01-03) | PASS |
| Marketing | 2 períodos (01-02) | PASS |
| Operações | 2 períodos (01-02) | PASS |
| Financeiro | 2 períodos (01-02) | PASS |

## 7. Navegação

| Check | Status |
|-------|--------|
| Seção `area-plans` no nav | PASS |
| `getNavigableAreas` usado | PASS |
| `AREA_LABELS` usado | PASS |

## 8. Padronização de IDs

| Check | Status |
|-------|--------|
| Zero IDs legados `action-mkt/ops/fin-*` | PASS |
| IDs padrão: `MKT-INB-01`, `OPS-RPA-01`, `FIN-AUT-01` | OK |

## 9. Hook useRBAC

| Check | Status |
|-------|--------|
| `useRBAC` exportado | PASS |
| `canAccess` no hook | PASS |
| `can(feature)` no hook | PASS |

---

## Build

- `tsc --noEmit` → **exit 0** (zero erros de tipo)
- `npm run build` → **exit 0** (build produção limpo)
- `npm run preview` → Rodando em `http://localhost:4179/`
