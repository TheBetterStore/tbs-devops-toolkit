import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {ISSMClient} from '../../../infrastructure/interfaces/ssm-client.interface';
import {SsmClient} from '../../../infrastructure/adapters/ssm-client';
import {IDynamoDBClient} from '../../../infrastructure/interfaces/dynamodb-client.interface';
import {DynamoDBClient} from '../../../infrastructure/adapters/dynamodb-client';
import {AppErrorService} from '../../services/app-error-service';
import {IAppErrorService} from '../../services/app-error-service.interface';

const container = new Container();

container.bind<ISSMClient>(TYPES.ISsmClient).to(SsmClient).inSingletonScope();
container.bind<IDynamoDBClient>(TYPES.IDynamoDBClient).to(DynamoDBClient).inSingletonScope();
container.bind<IAppErrorService>(TYPES.IAppErrorService).to(AppErrorService).inSingletonScope();

export default container;
