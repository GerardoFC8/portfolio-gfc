# Skill Registry — portfolio-gfc

**Last updated**: 2026-04-27
**Project conventions**: `~/.claude/CLAUDE.md` (global user config — voseo, no build, no AI co-author, etc.)

## User Skills (auto-loaded by context)

| Skill | Trigger | Compact rule |
|-------|---------|--------------|
| go-testing | Go test files, Bubbletea | N/A here |
| skill-creator | Creating new agent skills | N/A here |

## Project Standards (compact rules)

### Code style
- Match user language (default ES rioplatense / voseo).
- No `Co-Authored-By` in commits. Conventional commits.
- Never run build after changes unless asked. Never use cat/grep/find/sed/ls — use bat/rg/fd/sd/eza.
- Default to short answers, ask one question at a time and stop.

### React / Next.js
- React Compiler ON — manual `useMemo`/`useCallback` are anti-patterns.
- Next 16 → `proxy.ts` (not `middleware.ts`); export function name `proxy`.
- Server Components by default; `'use client'` only for interactivity.
- Prefer `next/image` over `<img>`; whitelist Supabase Storage domain.
- App Router patterns: cookies via `next/headers`, `createServerClient`/`createBrowserClient` factories from `lib/supabase/`.

### TypeScript
- No `any` in new code. Use Supabase `.returns<RowType>()` until generated types exist.

### React 19 lint rules to respect
- `react-hooks/set-state-in-effect` — fetch+setState patterns must move to Server Components or be reframed (mutations: action+revalidate; subscriptions: external store).
- `react-hooks/static-components` — never call `motion.create()` (or any HOC) inside a render body. Hoist to module scope.

## Files referenced
- `~/.claude/CLAUDE.md` — global user instructions (voseo, tone, philosophy)
