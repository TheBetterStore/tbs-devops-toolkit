import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {IConfigClient} from '../../../infrastructure/interfaces/config-client.interface';
import {ConfigClient} from '../../../infrastructure/adapters/config-client';

const container = new Container();

container.bind<IConfigClient>(TYPES.IConfigClient).to(ConfigClient).inSingletonScope();

export default container;
