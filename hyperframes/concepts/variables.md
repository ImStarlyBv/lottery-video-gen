# Variables

Variables let you declare named, typed slots in a composition and fill them at render time — from a parent composition, the CLI, or an API call.

## Declaration

Add `data-composition-variables` to the `<html>` root:

```html
<html data-composition-variables='[
  {"id": "title",  "type": "string", "label": "Title",        "default": "My Video"},
  {"id": "color",  "type": "color",  "label": "Accent Color", "default": "#f5c518"},
  {"id": "count",  "type": "number", "label": "Item Count",   "default": 5, "min": 1, "max": 20},
  {"id": "dark",   "type": "boolean","label": "Dark Mode",    "default": true},
  {"id": "style",  "type": "enum",   "label": "Style",        "default": "modern",
                                      "options": ["modern","retro","minimal"]}
]'>
```

### Supported Types

| Type | Extra fields |
|---|---|
| `string` | `placeholder`, `maxLength` |
| `number` | `min`, `max`, `step`, `unit` |
| `color` | hex format |
| `boolean` | — |
| `enum` | `options: string[]` |

## Accessing Values in Scripts

```javascript
const {
  title = "Untitled",
  color = "#f5c518",
  count = 5
} = window.__hyperframes.getVariables();

document.querySelector("#title").textContent = title;
```

## Override Layers (Precedence: Low → High)

1. **Declared defaults** — the `default` field in `data-composition-variables`
2. **Per-instance overrides** — `data-variable-values` on the host element in a parent composition
3. **CLI flags** — `--variables` or `--variables-file` at render time

## Passing from Parent Composition

```html
<!-- in parent index.html -->
<div data-composition-src="./card.html"
     data-start="2" data-duration="5" data-track-index="1"
     data-variable-values='{"title": "Lotería Nacional", "color": "#f5c518"}'>
</div>
```

## CLI Override

```bash
npx hyperframes render --output out.mp4 \
  --variables '{"title": "Números de Hoy", "color": "#ff0000"}'

# Or from a JSON file:
npx hyperframes render --output out.mp4 \
  --variables-file ./vars.json
```

## Validation

```bash
npx hyperframes lint             # warnings on missing/malformed variables
npx hyperframes render --strict-variables  # treat variable warnings as errors
```
