import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {SsmClient} from '../../../infrastructure/adapters/ssm-client';

const container = new Container();

container.bind<ISSMClient>(TYPES.ISsmClient).to(SsmClient).inSingletonScope();

export default container;
