import { ExtensionContext } from "vscode";
import { Environment } from "../configs/environment";

export interface IState {
  context?: ExtensionContext | null;
  environment?: Environment | null;
  instanceId: string;
}
