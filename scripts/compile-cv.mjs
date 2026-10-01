import { mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const out = mkdtempSync(join(tmpdir(), 'kaiming-cv-'));
try {
  const result = spawnSync('tectonic', ['-X', 'compile', resolve('cv/Kaiming_Liu_CV.tex'), '--outdir', out], { stdio: 'inherit' });
  if (result.error) throw new Error('Install the small Tectonic compiler or compile cv/Kaiming_Liu_CV.tex in Overleaf, then save the PDF in cv/.');
  if (result.status !== 0) throw new Error(`LaTeX compilation failed (${result.status}).`);
  copyFileSync(join(out, 'Kaiming_Liu_CV.pdf'), resolve('cv/Kaiming_Liu_CV.pdf'));
} finally {
  rmSync(out, { recursive: true, force: true });
}
