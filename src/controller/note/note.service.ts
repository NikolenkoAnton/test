import { Service } from 'typedi';
import { Note, User, UserNote } from '../../db/models';
import { GetNoteRequest, NoteSaveRequest } from './note.request';
import { Op } from 'sequelize';
@Service()
export class NoteService {
  async markNotePathAsRead(notePath: string, userId: number) {
    const userNote = await UserNote.findOne({ where: { user_id: userId, note_path: notePath } });

    if (userNote) {
      userNote.last_read_time = new Date();
      await userNote.save();
    } else {
      await UserNote.create({ user_id: userId, note_path: notePath });
    }
  }

  async getUnreadNotesCount(notePath: string, userId: number) {
    const where = { path: notePath };

    const lastTimeRead = await this.getLastTimeRead(notePath, userId);

    if (lastTimeRead) {
      where['created_at'] = { [Op.gt]: lastTimeRead };
    }

    const unreadCount = await Note.count({ where });

    return unreadCount;
  }

  async getLastTimeRead(notePath: string, userId: number) {
    const userNote = await UserNote.findOne({ where: { user_id: userId, note_path: notePath } });

    return userNote?.last_read_time || null;
  }

  async getNotes(query: GetNoteRequest, userId: number) {
    const offset = (query.page - 1) * query.per_page;

    const lastTimeRead = await this.getLastTimeRead(query.path, userId);

    const notes = await Note.findAll({
      where: { path: query.path },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],

      limit: query.per_page,
      offset: offset,
      order: [['created_at', 'DESC']],
    });

    await this.markNotePathAsRead(query.path, userId);

    return { notes, lastTimeRead };
  }

  async saveNote(noteData: NoteSaveRequest, userId: number) {
    const createdNote = await Note.create(
      { creator_id: userId, path: noteData.path, text: noteData.text },
      { returning: true, include: [{ model: User, as: 'user' }] },
    );

    const user = await User.findByPk(userId);

    await this.markNotePathAsRead(noteData.path, userId);

    createdNote.user = user;
    return createdNote;
  }
}
