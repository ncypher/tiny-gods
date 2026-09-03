from pathlib import Path

ROOT = Path(__file__).parent
source = (ROOT / "app.py").read_text(encoding="utf-8")
needle = 'html = html.replace("__TINY_GODS_CONFIG__", json.dumps(config))'
replacement = '''html = html.replace("__TINY_GODS_CONFIG__", json.dumps(config))
patch = (ROOT / "culture_v03.js").read_text(encoding="utf-8")
html = html.replace("</script></body></html>", "\\n" + patch + "\\n</script></body></html>")'''
if needle not in source:
    raise RuntimeError("Tiny Gods launcher patch point not found")
source = source.replace(needle, replacement)
exec(compile(source, str(ROOT / "app.py"), "exec"), {"__file__": str(ROOT / "app.py"), "__name__": "__main__"})
