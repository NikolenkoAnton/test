import { map, pick } from 'lodash';
import { Note } from '../../db/models';
import { ApiModelProperty, ApiModel } from 'swagger-express-ts';
@ApiModel({ name: 'CreatorResponse' })
class CreatorResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;
}
@ApiModel({ name: 'NoteResponse' })
export class NoteResponse {
  @ApiModelProperty()
  public id: number;

  @ApiModelProperty()
  public path: string;

  @ApiModelProperty()
  public text: string;

  @ApiModelProperty()
  public created_at: Date;

  @ApiModelProperty({ model: 'CreatorResponse' })
  public creator: CreatorResponse;

  constructor(data: Note) {
    this.id = data.id;
    this.path = data.path;
    this.text = data.text;
    this.created_at = data.created_at;
    this.creator = pick(data.user, ['id', 'name']);
  }
}

@ApiModel({ name: 'GetNotesResponse' })
export class GetNotesResponse {
  @ApiModelProperty({
    model: 'NoteResponse',
  })
  public notes: NoteResponse[];

  @ApiModelProperty()
  public lastTimeRead: Date;

  constructor(notes: Note[], lastTimeRead: Date) {
    this.notes = map(notes, (note) => new NoteResponse(note));
    this.lastTimeRead = lastTimeRead;
  }
}

@ApiModel({ name: 'UnreadNotesCountResponse' })
export class UnreadNotesCountResponse {
  @ApiModelProperty()
  public unreadCount: number;

  constructor(unreadCount: number) {
    this.unreadCount = unreadCount;
  }
}
