import config from '../config';
import * as path from 'path';
import * as fs from 'fs';
import { log } from './sentry';
import CmsImage from '../db/models/CmsImage';
import CmsImageItem from '../db/models/CmsImageItem';
import CmsImageItemToEntity from '../db/models/CmsImageItemToEntity';
import { IMAGE_DESTINATION_ENUM } from './constants';
import { Transaction } from 'sequelize';
import { NoDataError } from './errors';

export async function deleteFile(cms_image: CmsImage) {
  const fileStore = getFileStore(cms_image.section as IMAGE_DESTINATION_ENUM);

  const filePath = path.resolve(fileStore, `${cms_image.uuid}.${cms_image.extension}`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(path.resolve(fileStore, `${cms_image.uuid}.${cms_image.extension}`));
  }
  await cms_image.destroy();
  return true;
}

export const getFileStore = (section: IMAGE_DESTINATION_ENUM) => {
  const folder = [
    IMAGE_DESTINATION_ENUM.MAIN_BANNER_SLIDE,
    IMAGE_DESTINATION_ENUM.TOP_COMPETITION,
    IMAGE_DESTINATION_ENUM.FORM_BANNER_SLIDE,
    IMAGE_DESTINATION_ENUM.SITE_DOMAIN_LOGO,
  ].includes(section)
    ? 'cms_image'
    : section;

  return path.resolve(config.FILES_PATH, folder);
};

export async function uploadFile(file: Express.Multer.File, section: IMAGE_DESTINATION_ENUM) {
  if (!file || !file?.originalname) {
    return;
  }
  const ext = path.extname(file.originalname).slice(1);

  try {
    const file_path = path.resolve(config.FILES_PATH, section);

    const fileStore = getFileStore(section);
    if (!fs.existsSync(file_path)) {
      fs.mkdirSync(file_path);
    }
    if (!fs.existsSync(fileStore)) {
      fs.mkdirSync(fileStore);
    }

    const cms_image = await CmsImage.create({
      section,
      name: file.originalname,
      extension: ext,
    });

    const cms_image_item = await CmsImageItem.create({
      image_id: cms_image.id,
      extension: ext,
    });

    await fs.writeFileSync(path.resolve(file_path, `${cms_image_item.uuid}.${ext}`), file.buffer);
    await fs.writeFileSync(path.resolve(fileStore, `${cms_image.uuid}.${ext}`), file.buffer);

    return {
      cms_image_item_id: cms_image_item.id,
      cms_image_id: cms_image.id,
    };
  } catch (err) {
    log(err);
  }
  return null;
}

export async function uploadCmsImage(record, file, folder, transaction?: Transaction) {
  if (record.cms_image_item_id !== null) {
    deleteItem(record.cms_image_item_id, folder);
  }
  const { cms_image_item_id } = await uploadFile(file, folder);
  record.cms_image_item_id = cms_image_item_id;
  await record.save({ transaction });
}

export async function chooseFile(cms_image: CmsImage) {
  let cms_image_item;
  try {
    cms_image_item = await CmsImageItem.create({
      image_id: cms_image.id,
      extension: cms_image.extension,
    });

    const file_path = path.resolve(config.FILES_PATH, cms_image.section);

    const fileStore = getFileStore(cms_image.section as IMAGE_DESTINATION_ENUM);

    await fs.writeFileSync(
      path.resolve(file_path, `${cms_image_item.uuid}.${cms_image.extension}`),
      fs.readFileSync(path.resolve(fileStore, `${cms_image.uuid}.${cms_image.extension}`)),
    );
  } catch (err) {
    log(err);
  }
  return cms_image_item.id;
}

export async function deleteCmsImage(cmsImageId: number) {
  const cmsImage = await CmsImage.findByPk(cmsImageId);

  const fileStore = getFileStore(cmsImage.section as IMAGE_DESTINATION_ENUM);

  fs.unlinkSync(path.resolve(fileStore, `${cmsImage.uuid}.${cmsImage.extension}`));
  await cmsImage.destroy();
  return true;
}

export async function deleteItem(id: number, section: IMAGE_DESTINATION_ENUM) {
  const item = await CmsImageItem.findByPk(id);
  const file_path = path.resolve(config.FILES_PATH, section);
  fs.unlinkSync(path.resolve(file_path, `${item.uuid}.${item.extension}`));
  item.destroy();
  return true;
}

export const removeEntityCmsImageGallery = async (record, folder: IMAGE_DESTINATION_ENUM) => {
  const galleryItems = await CmsImageItemToEntity.findAll({
    where: {
      entity_id: record.id,
      entity_type: folder,
    },
  });

  if (galleryItems.length) {
    for (const galleryItem of galleryItems) {
      await deleteItem(galleryItem.cms_image_item_id, folder);
      await galleryItem.destroy();
    }
  }
};

export const relateExistingCmsGalleryItems = async (
  entity_id: number,
  file_ids: number[],
  section: IMAGE_DESTINATION_ENUM,
) => {
  for (const file_id of file_ids) {
    const cmsImage = await CmsImage.findByPk(file_id);

    if (!cmsImage) {
      //error  file not found
      throw new Error('file not found');
    }

    const cms_image_item_id = await chooseFile(cmsImage);

    if (!cms_image_item_id) {
      throw new NoDataError();
    }

    await CmsImageItemToEntity.create({
      cms_image_item_id,
      entity_id,
      entity_type: section,
    });
  }
};

export const uploadCmsGalleryItems = async (
  entity_id: number,
  files: Express.Multer.File[],
  folder: IMAGE_DESTINATION_ENUM,
) => {
  return Promise.all(files.map((file, i) => uploadCmsGalleryItem(entity_id, file, folder, i)));
};

export const uploadCmsGalleryItem = async (
  entity_id: number,
  file: Express.Multer.File,
  folder: IMAGE_DESTINATION_ENUM,
  position: number,
) => {
  const { cms_image_item_id } = await uploadFile(file, folder);
  await CmsImageItemToEntity.create({
    cms_image_item_id,
    entity_id,
    position,
    entity_type: folder,
  });
};
