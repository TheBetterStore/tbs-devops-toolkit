import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {IConfigClient} from '../../../infrastructure/interfaces/config-client.interface';
import {ConfigClient} from '../../../infrastructure/adapters/config-client';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {SsmClient} from '../../../infrastructure/adapters/ssm-client';
import {IDynamoDBClient} from '../../../infrastructure/interfaces/dynamodb-client.interface';
import {DynamoDBClient} from '../../../infrastructure/adapters/dynamodb-client';
import {IAppComplianceService} from '../../services/app-compliance-service.interface';
import {AppComplianceService} from '../../services/app-compliance-service';

const container = new Container();

container.bind<IConfigClient>(TYPES.IConfigClient).to(ConfigClient).inSingletonScope();
container.bind<ISSMClient>(TYPES.ISsmClient).to(SsmClient).inSingletonScope();
container.bind<IAppComplianceService>(TYPES.IAppComplianceService).to(AppComplianceService).inSingletonScope();
container.bind<IDynamoDBClient>(TYPES.IDynamoDBClient).to(DynamoDBClient).inSingletonScope();

export default container;
