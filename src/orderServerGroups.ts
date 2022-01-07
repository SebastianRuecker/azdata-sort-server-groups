// necessary imports
import * as vscode from 'vscode';

// own imports
import {state} from './configs/state';
import {FileService} from './services/file.service';
import {Commands} from './enums/command.enum';
import {RestoreBackup} from './actions/RestoreBackup';
import {SortConnections} from './actions/SortConnections';

export class OrderServerGroups {
    public async ProcessRestore(): Promise<any> {
        const files = await FileService.GetSettingsJsonFiles(state.environment?.USER_FOLDER ?? '');

        for (const file of (files || [])) {
            await RestoreBackup.PerformRestore(file);
        }
        vscode.commands.executeCommand(Commands.ReloadWindow);
    }

    public async ProcessOrdering(): Promise<any> {
        const files = await FileService.GetSettingsJsonFiles(state.environment?.USER_FOLDER ?? '');

        for (const file of (files || [])) {
            await SortConnections.PerformOrdering(file);
        }
        vscode.commands.executeCommand(Commands.ReloadWindow);
    }
}
