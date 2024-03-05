import { BurgerController } from './burger';
import { BetController } from './bet/bet.controller';
import { CategoryController } from './category';
import { CmsController } from './cms';
import {
  CmsFooterBlockController,
  CmsFooterBlockLogoController,
  CmsFooterBlockText,
  CmsFooterBlockChatController,
  CmsFooterBlockValidatorController,
} from './cms-footer';
import { CmsHeaderController } from './cms-header';
import { CompetitionController } from './competition';
import { CurrencyController } from './currency';
import { DataController } from './data';
import { GameController } from './game';
import { LanguageController } from './language';
import { SettingsController } from './settings';
import { TemplateController } from './template';
import { TranslateController } from './translate';
import { UserController } from './user/user.controller';
import { WidgetController } from './widget';
import { PlayerController } from './player/player.controller';
import { RmtController } from './rmt';
import { NoteController } from './note/note.controller';
import { GroupController } from './group/group.controller';
import { ComboBonusController } from './combo-bonus/combo-bonus.controller';

export default [
  DataController,
  TemplateController,
  UserController,
  WidgetController,
  TranslateController,
  GameController,
  BetController,
  CurrencyController,
  CategoryController,
  CompetitionController,
  CmsController,
  CmsFooterBlockLogoController,
  CmsFooterBlockText,
  CmsFooterBlockController,
  CmsFooterBlockChatController,
  CmsFooterBlockValidatorController,
  CmsHeaderController,
  SettingsController,
  LanguageController,
  BurgerController,
  PlayerController,
  RmtController,
  NoteController,
  GroupController,
  ComboBonusController,
];
