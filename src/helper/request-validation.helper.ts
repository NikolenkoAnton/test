import lodash from 'lodash';
import { extname } from 'path';
import { BadRequestError } from './errors';
const { castArray } = lodash;

const ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'svg'];
export const ALLOWED_PUBLIC_FILES_FORMATS = ['pdf', 'jpg', 'jpeg', 'png', 'svg'];

export const requestImagesValidation = (filesToValidate?: Express.Multer.File | Express.Multer.File[]) => {
  if (!filesToValidate) {
    return;
  }
  const files = castArray(filesToValidate);

  files.forEach((file) => {
    const fileExtension = extname(file.originalname).slice(1);

    if (!ALLOWED_IMAGE_FORMATS.includes(fileExtension)) {
      throw new BadRequestError(`You cannot upload image with extension ${fileExtension}`);
    }
  });
};
