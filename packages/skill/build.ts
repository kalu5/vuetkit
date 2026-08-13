/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'

interface PackageConfig {
  name: string
  display: string
  npmName: string
}

interface FunctionInfo {
  name: string
  packageName: string
  npmPackage: string
  packageDisplay: string
  category: string
  description: string
  mdContent: string
  typesContent: string
}

const PACKAGES: PackageConfig[] = [
  { name: 'shared', display: 'Shared Utilities', npmName: '@vuecraft/shared' },
  { name: 'core', display: 'Core Composables', npmName: '@vuecraft/core' },
  { name: 'components', display: 'Composable Components', npmName: '@vuecraft/components' },
]

const ROOT = path.resolve(import.meta.dirname, '..')
const SKILL_DIR = path.join(import.meta.dirname, 'skills', 'vuecraft-functions')
const REFERENCE_DIR = path.join(SKILL_DIR, 'references')
const TEMPLATE_PATH = path.join(import.meta.dirname, 'templates', 'skill.md')

// --- Main ---

async function main() {
  const functions = scanAllFunctions()

  // Clean and create reference directory
  fs.rmSync(REFERENCE_DIR, { recursive: true, force: true })
  fs.mkdirSync(REFERENCE_DIR, { recursive: true })

  // Generate reference files
  for (const fn of functions) {
    const refContent = generateReferenceContent(fn)
    const refPath = path.join(REFERENCE_DIR, `${fn.name}.md`)
    fs.writeFileSync(refPath, refContent)
  }

  // Generate main SKILL.md
  const functionsTable = generateFunctionsTable(functions)
  let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8')
  template = template.replace('<!-- FUNCTIONS_TABLE_PLACEHOLDER -->', functionsTable)
  fs.writeFileSync(path.join(SKILL_DIR, 'SKILL.md'), template)

  console.log(`Generated ${functions.length} function references`)
  console.log(`SKILL.md written to ${path.join(SKILL_DIR, 'SKILL.md')}`)
}

// --- Scanning ---

function scanAllFunctions(): FunctionInfo[] {
  const functions: FunctionInfo[] = []

  for (const pkg of PACKAGES) {
    const srcDir = path.join(ROOT, pkg.name, 'src')
    if (!fs.existsSync(srcDir))
      continue

    const categories = fs.readdirSync(srcDir).filter(
      name => fs.statSync(path.join(srcDir, name)).isDirectory(),
    )

    for (const category of categories) {
      const categoryDir = path.join(srcDir, category)
      const entries = fs.readdirSync(categoryDir)

      for (const entry of entries) {
        const entryPath = path.join(categoryDir, entry)
        if (!fs.statSync(entryPath).isDirectory())
          continue

        const mdPath = path.join(entryPath, 'index.md')
        const tsPath = path.join(entryPath, 'index.ts')

        if (!fs.existsSync(mdPath) || !fs.existsSync(tsPath))
          continue

        const mdContent = fs.readFileSync(mdPath, 'utf-8')
        const tsContent = fs.readFileSync(tsPath, 'utf-8')
        const description = extractDescription(mdContent)
        const typesContent = extractTypeDeclarations(tsContent)

        functions.push({
          name: entry,
          packageName: pkg.name,
          npmPackage: pkg.npmName,
          packageDisplay: pkg.display,
          category,
          description,
          mdContent,
          typesContent,
        })
      }
    }
  }

  return functions
}

// --- Description Extraction ---

function extractDescription(md: string): string {
  const lines = md.split('\n')

  // Skip the title line (# functionName)
  // Find the first meaningful line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line)
      continue
    // Skip headings
    if (line.startsWith('#'))
      continue
    // Skip VitePress tip blocks
    if (line.startsWith(':::'))
      continue
    // Skip list items
    if (line.startsWith('-'))
      continue

    // Found the description line
    return line
  }

  return ''
}

// --- Type Declaration Extraction ---

function extractTypeDeclarations(source: string): string {
  const lines = source.split('\n')
  const result: string[] = []

  // Collect import type statements (for context)
  const importTypes = lines.filter(l => l.trim().startsWith('import type'))
  result.push(...importTypes)
  if (importTypes.length > 0)
    result.push('')

  // Extract export declarations
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (!trimmed.startsWith('export ')) {
      i++
      continue
    }

    // Skip re-exports (export * from, export { ... } from)
    if (/^export\s+(?:\*|\{)/.test(trimmed)) {
      i++
      continue
    }

    if (/^export\s+(?:interface|enum)\s+\w/.test(trimmed)) {
      const block = collectBlock(lines, i)
      if (block.content) {
        result.push(block.content)
        result.push('')
      }
      i = block.nextIndex
    }
    else if (/^export\s+type\s+\w/.test(trimmed)) {
      // Type alias - could be single line or multi-line with braces/brackets
      if (trimmed.includes('=') && !trimmed.endsWith('{') && !trimmed.endsWith('[') && !trimmed.endsWith(',')) {
        result.push(trimmed)
        result.push('')
        i++
      }
      else {
        const block = collectBlock(lines, i)
        if (block.content) {
          result.push(block.content)
          result.push('')
        }
        i = block.nextIndex
      }
    }
    else if (/^export\s+function\s+\w/.test(trimmed)) {
      const sig = extractFunctionSignature(lines, i)
      if (sig.content) {
        result.push(sig.content)
        result.push('')
      }
      i = sig.nextIndex
    }
    else if (/^export\s+const\s+\w/.test(trimmed)) {
      result.push(trimmed)
      result.push('')
      i++
    }
    else {
      i++
    }
  }

  return result.join('\n').trim()
}

function collectBlock(lines: string[], start: number): { content: string, nextIndex: number } {
  const collected: string[] = []
  let braceDepth = 0
  let bracketDepth = 0
  let foundBlock = false

  for (let i = start; i < lines.length; i++) {
    collected.push(lines[i])

    for (const char of lines[i]) {
      if (char === '{') {
        braceDepth++
        foundBlock = true
      }
      else if (char === '}') {
        braceDepth--
      }
      else if (char === '[') {
        bracketDepth++
        foundBlock = true
      }
      else if (char === ']') {
        bracketDepth--
      }
    }

    if (foundBlock && braceDepth === 0 && bracketDepth === 0) {
      return { content: collected.join('\n'), nextIndex: i + 1 }
    }
  }

  // If no braces/brackets found (e.g., single-line type without braces)
  if (!foundBlock && collected.length > 0) {
    return { content: collected.join('\n'), nextIndex: lines.length }
  }

  return { content: '', nextIndex: lines.length }
}

function extractFunctionSignature(lines: string[], start: number): { content: string, nextIndex: number } {
  const collected: string[] = []
  let parenDepth = 0
  let foundCloseParen = false

  for (let i = start; i < lines.length; i++) {
    const line = lines[i]

    // Track parenthesis depth to know when parameters are complete
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '(') {
        parenDepth++
      }
      else if (char === ')') {
        parenDepth--
        if (parenDepth === 0) {
          foundCloseParen = true
        }
      }
    }

    if (foundCloseParen) {
      // Parameters are closed, now find the opening brace of the body
      const braceIdx = line.indexOf('{')
      if (braceIdx !== -1) {
        // Body starts on this line
        const sigPart = line.slice(0, braceIdx).trim()
        collected.push(sigPart)

        // Skip the function body using brace matching
        let bodyDepth = 0
        let bodyStarted = false

        for (let j = i; j < lines.length; j++) {
          const bodyLine = j === i ? line.slice(braceIdx) : lines[j]
          for (const char of bodyLine) {
            if (char === '{') {
              bodyDepth++
              bodyStarted = true
            }
            else if (char === '}') {
              bodyDepth--
            }
          }
          if (bodyStarted && bodyDepth === 0) {
            return { content: `${collected.join('\n')};`, nextIndex: j + 1 }
          }
        }
      }
      else {
        // Return type annotation might span multiple lines
        // Collect this line and continue looking for {
        collected.push(line)
      }
    }
    else {
      collected.push(line)
    }
  }

  return { content: collected.join('\n'), nextIndex: lines.length }
}

// --- Reference File Generation ---

function generateReferenceContent(fn: FunctionInfo): string {
  const frontmatter = [
    '---',
    `category: ${fn.category}`,
    `package: ${fn.npmPackage}`,
    '---',
  ].join('\n')

  let content = `${frontmatter}\n\n`
  content += `${fn.mdContent.trim()}\n`

  if (fn.typesContent) {
    content += `\n## Type Declarations\n\n\`\`\`ts\n${fn.typesContent}\n\`\`\`\n`
  }

  return content
}

// --- SKILL.md Table Generation ---

function generateFunctionsTable(functions: FunctionInfo[]): string {
  let table = ''

  // Group by package then by category
  const grouped = new Map<string, Map<string, FunctionInfo[]>>()

  for (const fn of functions) {
    if (!grouped.has(fn.packageDisplay))
      grouped.set(fn.packageDisplay, new Map())

    const categoryMap = grouped.get(fn.packageDisplay)!
    if (!categoryMap.has(fn.category))
      categoryMap.set(fn.category, [])

    categoryMap.get(fn.category)!.push(fn)
  }

  for (const [pkgDisplay, categoryMap] of grouped) {
    table += `### ${pkgDisplay}\n\n`
    table += '| Function | Description | Package | Invocation |\n'
    table += '|----------|-------------|---------|------------|\n'

    for (const [, fns] of categoryMap) {
      for (const fn of fns) {
        const desc = fn.description.replace(/\|/g, '\\|')
        table += `| [\`${fn.name}\`](references/${fn.name}.md) | ${desc} | \`${fn.npmPackage}\` | AUTO |\n`
      }
    }
    table += '\n'
  }

  return table.trim()
}

main().catch(console.error)
