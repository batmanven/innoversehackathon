import type { DocumentAnalysis } from "@/types/lexiguide";

/**
 * Generates a comprehensive Markdown report from the document analysis.
 */
export function generateMarkdownReport(analysis: DocumentAnalysis): string {
  const date = new Date().toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const risks = analysis.risks.map(r => {
    const icon = r.severity === "high" ? "🔴 HIGH" : r.severity === "medium" ? "🟡 MEDIUM" : "⚪ LOW";
    return `### ${icon}: ${r.title}\n**Clause**: ${r.clauseRef} | **Tags**: ${r.tags.join(", ")}\n\n${r.description}\n`;
  }).join("\n");

  const rights = analysis.rights.map(r => 
    `### ${r.title}\n**Clause**: ${r.clauseRef} | **Tags**: ${r.tags.join(", ")}\n\n${r.description}\n`
  ).join("\n");

  const mustDo = analysis.checklist.filter(c => c.group === "must");
  const mustNotDo = analysis.checklist.filter(c => c.group === "must_not");
  const deadlines = analysis.checklist.filter(c => c.group === "deadlines");

  const checklistSection = `
## ☑️ Action Checklist

### Things You MUST Do
${mustDo.map(c => `- [ ] **${c.action}**: ${c.detail}`).join("\n")}

### Things You MUST NOT Do
${mustNotDo.map(c => `- [ ] **${c.action}**: ${c.detail}`).join("\n")}

### Important Deadlines
${deadlines.map(c => `- [ ] **${c.action}**: ${c.detail} (Due: ${c.due})`).join("\n")}
  `;

  return `# LexiGuide Analysis Report
**Document**: ${analysis.fileName}
**Analyzed as**: ${analysis.persona} | **Language**: ${analysis.language}
**Date**: ${date}

---

## 📝 Executive Summary
> ${analysis.summary.headline}

${analysis.summary.bullets.map(b => `- ${b.text}`).join("\n")}

---

## ⚠️ Risks & Obligations
${risks}

---

## ✅ Your Rights & Protections
${rights}

---
${checklistSection}

---
*Disclaimer: This is an AI-generated assistant report for informational purposes and does not constitute legal advice.*
`;
}

/**
 * Triggers a browser download of the given content.
 */
export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the report content to the clipboard.
 */
export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    return false;
  }
}
