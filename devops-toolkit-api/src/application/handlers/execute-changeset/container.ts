import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {ICFClient} from '../../../infrastructure/interfaces/cf-client.interface';
import {CFClient} from '../../../infrastructure/adapters/cf-client';

const container = new Container();

container.bind<ICFClient>(TYPES.ICFClient).to(CFClient).inSingletonScope();
export default container;
