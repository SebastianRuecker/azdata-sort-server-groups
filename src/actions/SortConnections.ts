import {FileService} from '../services/file.service';
import {ConnectionGroupItem} from '../models/connectionGroup.model';
import {ConfigSections} from '../enums/configSections.enum';
import {ConnectionInformationItem} from '../models/connectionInformation.model';
import {File} from '../models/file.model';

export class SortConnections {
    public static async PerformOrdering(file: File): Promise<any> {
        await FileService.BackupConfigFile(file);

        const jsonData = JSON.parse(file.content);

        const groups = ConnectionGroupItem.fromJsonArray(jsonData[ConfigSections.GROUPS]);
        const connections = ConnectionInformationItem.fromJsonArray(jsonData[ConfigSections.CONNECTIONS]);

        const orderedGroups = await this.OrderGroups(groups);

        jsonData[ConfigSections.GROUPS] = orderedGroups;
        jsonData[ConfigSections.CONNECTIONS] = await this.OrderConnections(connections, orderedGroups);

        await FileService.WriteFile(file.filePath, JSON.stringify(jsonData));
    }

    private static async OrderGroups(allGroups: ConnectionGroupItem[],
                                     parentId: string | null = null): Promise<ConnectionGroupItem[]> {
        const result: ConnectionGroupItem[] = [];
        if (allGroups.length === 0) {
            return result;
        }

        const nodes = allGroups
            .filter((x) => x.parentId === parentId)
            .sort((a, b) => {
                const firstItem = (a.name || '').toLowerCase();
                const secondItem = (b.name || '').toLowerCase();

                return firstItem < secondItem ? -1 : firstItem > secondItem ? 1 : 0;
            });

        for (const node of (nodes || [])) {
            result.push(node);

            if (allGroups.filter((x) => x.parentId === node.id).length > 0) {
                const siblings = await this.OrderGroups(allGroups, node.id);
                if (siblings) {
                    result.push(...siblings);
                }
            }
        }

        return result;
    }

    private static async OrderConnections(allConnections: ConnectionInformationItem[],
                                          allGroups: ConnectionGroupItem[]): Promise<ConnectionInformationItem[]> {
        const result: ConnectionInformationItem[] = [];

        if (allConnections.length === 0) {
            return result;
        }

        for (const group of (allGroups || [])) {
            const assignedConnections = allConnections
                .filter((x) => x.groupId === group.id)
                .sort((a, b) => {
                    const firstItem = (a.options?.connectionName || '').toLowerCase();
                    const secondItem = (b.options?.connectionName || '').toLowerCase();

                    return firstItem < secondItem ? -1 : firstItem > secondItem ? 1 : 0;
                });

            if (assignedConnections.length === 0) {
                continue;
            }

            result.push(...assignedConnections);
        }

        return result;
    }
}
