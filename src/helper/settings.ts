import multer from 'multer';

export function configureDomainMulter() {
  return multer({
    storage: multer.memoryStorage(),
  }).fields([
    { maxCount: 1, name: 'big_logo_image' },
    { maxCount: 1, name: 'small_logo_image' },
    { maxCount: 1, name: 'favicon_image' },
  ]);
}
