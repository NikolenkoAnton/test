import { Request } from 'express';
import { Body, Delete, Post, QueryParams, Req, UploadedFile } from 'routing-controllers';
import { ApiOperationDelete, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import {
  deleteLanguage,
  getLanguages,
  patchManyLanguages,
  saveLanguage,
  updateLanguage,
} from '../../swagger/operations/language';
import { UserLog } from '../db/models';
import { DEFAULT_SUCCESS_RESPONSE, PatchActiveAndPositionDto, QueryWithId } from '../dto';
import { MAX_LANGUAGE_ICON_FILE_SIZE, USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { requestImagesValidation } from '../helper/request-validation.helper';
import { TranslateLanguageService } from '../service/language.service';
import { CreateLanguageRequest, UpdateLanguageRequest } from '../dto';
import { GetLanguagesDto } from '../dto';
import { DeleteByIdDto } from '../dto/response/shared';
import sequelize from '../db';
import { log } from '../helper/sentry';
import { SaveError, ServerError } from '../helper/errors';

@DefaultController('/settings/language', 'Settings Language')
export class LanguageController {
  @Inject()
  private readonly languageService: TranslateLanguageService;

  @ApiOperationPost(getLanguages)
  @Post('')
  async getLanguages(@Body() body: GetLanguagesDto) {
    const languages = await this.languageService.getLanguages(body);

    return languages.map((language) => language.toJSON());
  }

  @ApiOperationPost(saveLanguage)
  @Post('save')
  async saveLanguage(
    @UploadedFile('icon', {
      options: {
        limits: { fileSize: MAX_LANGUAGE_ICON_FILE_SIZE },
      },
    })
    icon: Express.Multer.File,
    @Body() body: CreateLanguageRequest,
    @Req() request: Request,
  ) {
    requestImagesValidation(icon);
    await this.languageService.validateLanguage(body);

    try {
      const createdLanguage = await this.languageService.createTranslateLanguage(body, icon);
      await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_LANGUAGE_CREATE, request);
      return createdLanguage;
    } catch (e) {
      throw new Error(e);
    }
  }

  @ApiOperationPost(updateLanguage)
  @Post('update')
  async updateLanguage(
    @UploadedFile('icon', {
      options: {
        limits: { fileSize: MAX_LANGUAGE_ICON_FILE_SIZE },
      },
    })
    icon: Express.Multer.File,
    @Body() body: UpdateLanguageRequest,
    @Req() request: Request,
  ) {
    requestImagesValidation(icon);
    await this.languageService.validateLanguage(body);
    const updatedLanguage = await this.languageService.updateTranslateLanguage(body, icon);
    await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_LANGUAGE_UPDATE, request);

    return updatedLanguage;
  }

  @ApiOperationDelete(deleteLanguage)
  @Delete('delete')
  async deleteLanguage(@QueryParams() data: QueryWithId, @Req() request: Request) {
    const { id } = data;

    await this.languageService.checkLanguageOnDelete(id);

    const transaction = await sequelize.transaction();
    try {
      await this.languageService.deleteLanguage(id, transaction);
      await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_LANGUAGE_DELETE, request, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new ServerError('Language delete failed');
    }

    return DEFAULT_SUCCESS_RESPONSE;
  }

  @ApiOperationPost(patchManyLanguages)
  @Post('patchMany')
  async updateLanguages(@Req() req: Request, @Body() body: PatchActiveAndPositionDto) {
    await Promise.all(body.data.map((language) => this.languageService.validateLanguage(language)));
    await this.languageService.patchManyLanguages(body.data, req);

    return DEFAULT_SUCCESS_RESPONSE;
  }
}
