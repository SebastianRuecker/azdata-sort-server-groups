import {FileService} from '../services/file.service';
import {File} from '../models/file.model';

export class RestoreBackup {
    public static async PerformRestore(file: File): Promise<any> {
        const backupFilePath = file.filePath.concat('.bak');
        const backupExists = await FileService.FileExists(backupFilePath);

        if (!backupExists) {
            return null;
        }

        const backupRestored = await FileService.WriteFile(file.filePath, file.content);

        if (backupRestored) {
            await FileService.DeleteFile(backupFilePath);
        }
    }
}
