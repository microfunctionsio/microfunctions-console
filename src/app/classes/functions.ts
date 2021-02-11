import {Status} from './status';


export interface Functions {
  // id?: string;
  idFunctions: string;
  name: string;
  memory: string;
  idUser: string;
  idNamespace: string;
  executedName: string;
  replicas: number;
  runtime?: string;
  sourceCode?: any;
  packageJson?: any;
  status: Status;
  environments: {
    name: string,
    value: string,
  }[];
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface ReplicasStatus {
  name: string;
  status: string;
  statusMessage: string;
  statusPhase: string;
  restartsCount: number;
  cpu?: string;
  memory?: string;

}

