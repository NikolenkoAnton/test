import { ApiOperationGet, ApiPath } from 'swagger-express-ts';
import { Controller, Get, UseAfter, UseBefore, UseInterceptor } from 'routing-controllers';
import { Service } from 'typedi';
import { loggingAfter, loggingBefore } from '../middleware/middleware';
import responseInterceptor from '../interceptor/responseInterceptor';
import { CurrencyDto, GetCurrenciesResponseDto } from '../dto';
import { getCurrencies } from '../../swagger/operations/currency';
import { Currency } from '../db/models';
import { DefaultController } from '../helper/custom-controller.decorator';

@DefaultController('/currency', 'Currency')
export class CurrencyController {
  @ApiOperationGet(getCurrencies)
  @Get('currencies')
  async getCurrencies(): Promise<GetCurrenciesResponseDto> {
    const currencies = await Currency.findAll();
    const rows: CurrencyDto[] = currencies.map((curr) => {
      return {
        id: curr.id,
        name: curr.name,
        name_plural: curr.name_plural,
        code: curr.code,
        value: curr.value,
      };
    });

    return {
      rows,
    };
  }
}
