'use strict';

import * as fs from 'fs-extra';
import * as path from 'path';
import * as recursiveRead from 'recursive-readdir';
import {DesiredConfigFile, IgnoreFiles, IgnoreFolders, SupportedFileExtensions} from '../configs/fileService.config';
import {File} from '../models/file.model';

export class FileService {
    public static async ReadFile(filePath: string): Promise<string> {
        try {
            return await fs.readFile(filePath, {encoding: 'utf8'});
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public static async GetFile(filePath: string): Promise<any> {
        if (!await FileService.FileExists(filePath)) {
            return null;
        }

        let content: string;

        try {
            content = await FileService.ReadFile(filePath);
        } catch (err) {
            console.error(err);
            content = '';
        }

        return new File(FileService.ExtractFileName(filePath), filePath, content);
    }

    public static async WriteFile(filePath: string, data: string): Promise<boolean> {
        if (!data) {
            console.error(new Error(`Unable to write file. FilePath: '${filePath}' Data: '${data}'`));
            return false;
        }

        try {
            await fs.writeFile(filePath, data);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public static async ListFiles(directory: string): Promise<File[]> {
        function folderMatcher(file: string, stats: fs.Stats) {
            if (stats.isDirectory()) {
                return IgnoreFolders.some((fold: string) => {
                    return file.split(path.sep).includes(fold);
                });
            }
            return false;
        }

        function fileExtensionMatcher(file: string, stats: fs.Stats) {
            if (stats.isDirectory()) {
                return false;
            }
            const ext = path.extname(file).slice(1);
            return !SupportedFileExtensions.includes(ext);
        }

        const files = await recursiveRead(directory, [
            ...IgnoreFiles,
            folderMatcher,
            fileExtensionMatcher,
        ]);
        return Promise.all(files.map((file: string) => FileService.GetFile(file)));
    }

    public static async DeleteFile(filePath: string): Promise<boolean> {
        try {
            const stat: boolean = await FileService.FileExists(filePath);
            if (stat) {
                await fs.unlink(filePath);
            }
            return true;
        } catch (err) {
            console.error('Unable to delete file. File Path is :' + filePath);
            return false;
        }
    }

    public static async FileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    public static async GetSettingsJsonFiles(dir: string): Promise<File[]> {
        const files = await FileService.ListFiles(dir);
        const result: File[] = [];

        for (const file of (files || [])) {
            if (file.fileName !== DesiredConfigFile) {
                continue;
            }
            result.push(file);
        }

        return result;
    }

    public static async BackupConfigFile(file: File): Promise<boolean> {
        try {
            // check if bak file exists, if yes then delete the bak file
            const backupFilePath = file.filePath.concat('.bak');
            const backupFileExists = await FileService.FileExists(backupFilePath);

            if (backupFileExists) {
                const fileDeleted = await FileService.DeleteFile(backupFilePath);

                if (!fileDeleted) {
                    return Promise.reject(new Error('Backup file could not be removed!'));
                }
            }

            return await FileService.WriteFile(backupFilePath, file.content);
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public static ExtractFileName(fullPath: string): string {
        return path.basename(fullPath);
    }
}
