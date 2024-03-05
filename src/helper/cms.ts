import { IMAGE_DESTINATION_ENUM } from './constants';
import path from 'path';
import config from '../config';
import fs from 'fs';
import crypto from 'crypto';
import CmsFile from '../db/models/CmsFile';
import { getFileStore } from './image';

export const uploadPublicFile = async (file: Express.Multer.File): Promise<any> => {
  const section = IMAGE_DESTINATION_ENUM.CMS;
  if (!file || !file?.originalname) {
    return;
  }
  const ext = path.extname(file.originalname).slice(1);

  const file_path = path.resolve(config.FILES_PATH, section);
  if (!fs.existsSync(file_path)) {
    fs.mkdirSync(file_path);
  }

  const fileName = crypto.randomUUID();
  const filePath = path.resolve(file_path, `${fileName}.${ext}`);
  await fs.writeFileSync(filePath, file.buffer);

  return {
    fileName,
    ext,
  };
};

export async function deletePublicFile(cms_file: CmsFile) {
  const fileStore = getFileStore(IMAGE_DESTINATION_ENUM.CMS as IMAGE_DESTINATION_ENUM);

  const filePath = path.resolve(fileStore, `${cms_file.uuid}.${cms_file.extension}`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(path.resolve(fileStore, `${cms_file.uuid}.${cms_file.extension}`));
  }
  return true;
}
