import { Request } from 'express';
import { Body, Get, Post, QueryParams, Req } from 'routing-controllers';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import { getNote, getUnreadNotesCount, saveNoteSchema } from '../../../swagger/operations/note';
import { User, UserLog } from '../../db/models';
import { USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { UserFromRequest } from '../../helper/user.parameter.decorator';
import { GetNoteRequest, GetUnreadNotesCountRequest, NoteSaveRequest } from './note.request';
import { GetNotesResponse, NoteResponse, UnreadNotesCountResponse } from './note.response';
import { NoteService } from './note.service';
@DefaultController('/note', 'Note', [])
export class NoteController {
  @Inject()
  private noteService: NoteService;

  @ApiOperationPost(saveNoteSchema)
  @Post('save')
  async saveNote(@UserFromRequest() user: User, @Body({ required: true }) body: NoteSaveRequest, @Req() req: Request) {
    const response = await this.noteService.saveNote(body, user.id);

    await UserLog.add(USER_LOG_ACTIONS.SAVE_NOTE, req);

    return new NoteResponse(response);
  }

  @ApiOperationGet(getUnreadNotesCount)
  @Get('unread-count')
  async getUnreadCount(@UserFromRequest() user: User, @QueryParams() query: GetUnreadNotesCountRequest) {
    const unreadCount = await this.noteService.getUnreadNotesCount(query.path, user.id);
    return new UnreadNotesCountResponse(unreadCount);
  }

  @ApiOperationGet(getNote)
  @Get('')
  async getNotes(@UserFromRequest() user: User, @QueryParams() query: GetNoteRequest) {
    const { notes, lastTimeRead } = await this.noteService.getNotes(query, user.id);

    return new GetNotesResponse(notes, lastTimeRead);
  }
}
