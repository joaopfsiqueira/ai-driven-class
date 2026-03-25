#!/usr/bin/env python3
"""Gera PDF a partir do relatório Markdown (formatação simples). Requer: pip install reportlab"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import cm
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
except ImportError:
    print("Instale reportlab: pip3 install reportlab", file=sys.stderr)
    sys.exit(1)


def md_to_flowables(md_path: Path):
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    styles = getSampleStyleSheet()
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontSize=16,
        spaceAfter=12,
        leading=18,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontSize=13,
        spaceAfter=8,
        leading=16,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        spaceAfter=6,
    )
    mono = ParagraphStyle(
        "Mono",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8,
        leading=11,
        leftIndent=12,
        spaceAfter=8,
    )
    flow = []
    in_code = False
    code_buf: list[str] = []

    def flush_code():
        nonlocal code_buf
        if code_buf:
            raw = html.escape("\n".join(code_buf))
            flow.append(Paragraph(f"<font face='Courier'>{raw.replace(chr(10), '<br/>')}</font>", mono))
            code_buf = []

    for line in lines:
        if line.strip().startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                in_code = True
            continue
        if in_code:
            code_buf.append(line)
            continue
        if not line.strip():
            flow.append(Spacer(1, 0.2 * cm))
            continue
        if line.startswith("# "):
            flow.append(Paragraph(html.escape(line[2:].strip()), h1))
            continue
        if line.startswith("## "):
            flow.append(Paragraph(html.escape(line[3:].strip()), h2))
            continue
        if line.startswith("### "):
            flow.append(Paragraph(html.escape(line[4:].strip()), h2))
            continue
        if line.startswith("|") and "|" in line[1:]:
            # Tabela: uma linha como texto monoespaçado simplificado
            flow.append(Paragraph(html.escape(line), mono))
            continue
        if re.match(r"^[-*] ", line):
            flow.append(Paragraph("• " + html.escape(line[2:].strip()), body))
            continue
        if re.match(r"^\d+\.\s", line):
            flow.append(Paragraph(html.escape(line.strip()), body))
            continue
        # negrito **texto**
        esc = html.escape(line)
        esc = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", esc)
        flow.append(Paragraph(esc, body))
    flush_code()
    return flow


def main():
    base = Path(__file__).resolve().parent
    md = base / "RELATORIO_REFATORACAO_SOLID.md"
    pdf = base / "RELATORIO_REFATORACAO_SOLID.pdf"
    if not md.is_file():
        print(f"Não encontrado: {md}", file=sys.stderr)
        sys.exit(1)
    doc = SimpleDocTemplate(
        str(pdf),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    doc.build(md_to_flowables(md))
    print(f"Gerado: {pdf}")


if __name__ == "__main__":
    main()
