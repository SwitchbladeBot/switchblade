import { BaseHandler, IBaseHandlerOptions } from '../common/BaseHandler';
import { BaseModule } from '../common/BaseModule';
import { Main } from '../Main';

export default class CommonModulesHandler extends BaseHandler<BaseModule> {
    constructor(main: Main, options: IBaseHandlerOptions) {
        super(main, options);
    }
}
