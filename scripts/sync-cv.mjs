import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('public/cv', { recursive: true });
mkdirSync('public/assets/cv', { recursive: true });
for (const extension of ['pdf', 'tex']) {
  copyFileSync(`cv/Kaiming_Liu_CV.${extension}`, `public/cv/Kaiming_Liu_CV.${extension}`);
}
// Keep the original site's CV URL working, serving the current PDF.
copyFileSync('cv/Kaiming_Liu_CV.pdf', 'public/assets/cv/Kaiming_Liu_CV.pdf');
