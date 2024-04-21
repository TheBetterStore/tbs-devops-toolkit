import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {IConfigClient} from '../../../infrastructure/interfaces/config-client.interface';
import {ConfigClient} from '../../../infrastructure/adapters/config-client';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {SsmClient} from '../../../infrastructure/adapters/ssm-client';

const container = new Container();

container.bind<IConfigClient>(TYPES.IConfigClient).to(ConfigClient).inSingletonScope();
container.bind<ISSMClient>(TYPES.ISsmClient).to(SsmClient).inSingletonScope();

export default container;
