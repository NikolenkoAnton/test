import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { ComboBonus } from '../../db/models';

@Middleware({ type: 'before' })
export class FindComboBonusMiddleware implements ExpressMiddlewareInterface {
  async use(request: any, response: any, next: (err?: any) => any): Promise<void> {
    const id = request?.body?.id;

    if (id) {
      const comboBonus = await ComboBonus.findByPk(id);

      if (!comboBonus) {
        throw new Error('Combo bonus not found');
      }
    }
    next();
  }
}
