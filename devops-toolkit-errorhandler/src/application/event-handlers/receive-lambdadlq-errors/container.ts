import {Container} from 'inversify';
import TYPES from '../../../infrastructure/types';
import {IDynamoDBClient} from "../../../infrastructure/interfaces/dynamodb-client.interface";
import {DynamoDBClient} from "../../../infrastructure/adapters/aws/dynamodb-client";
import {DlqErrorService} from "../../services/dlqerror-service";
import {IDlqErrorService} from "../../services/dlqerror-service.interface";

const container = new Container();

container.bind<IDlqErrorService>(TYPES.IDlqErrorService).to(DlqErrorService).inSingletonScope();
container.bind<IDynamoDBClient>(TYPES.IDynamoDBClient).to(DynamoDBClient).inSingletonScope();

export default container;
