import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {DlqErrorService} from "../../services/dlqerror-service";
import {IDlqErrorService} from "../../services/dlqerror-service.interface";
import { IAwsDynamoDBClient } from '../../../infrastructure/interfaces/aws-dynamodb-client.interface';
import { AwsDynamoDBClient } from '../../../infrastructure/adapters/aws/aws-dynamodb-client';

const container = new Container();

container.bind<IDlqErrorService>(TYPES.IDlqErrorService).to(DlqErrorService).inSingletonScope();
container.bind<IAwsDynamoDBClient>(TYPES.IAwsDynamoDBClient).to(AwsDynamoDBClient).inSingletonScope();

export default container;
