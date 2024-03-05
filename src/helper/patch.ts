import { PatchActiveAndPositionElementDto } from '../dto';
import { Transaction } from 'sequelize';

export const patchManyEntities = (model, updateData: PatchActiveAndPositionElementDto[], transaction?: Transaction) => {
  const promises = [];
  updateData.map((item) => {
    promises.push(model.update(item, { where: { id: item.id }, transaction }));
  });
  return Promise.all(promises);
};
