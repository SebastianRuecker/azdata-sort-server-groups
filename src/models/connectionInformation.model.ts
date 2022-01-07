import {ConnectionInformationOption} from './connectionInformationOption.model';

export class ConnectionInformationItem {
    public static fromJsonArray(rawJson: any[] = []): ConnectionInformationItem[] {
        const result: ConnectionInformationItem[] = [];

        if (!rawJson) {
            return result;
        }

        (rawJson || []).forEach((entry) => {
            const item = ConnectionInformationItem.fromRawJson(entry);

            if (!item) {
                return;
            }

            result.push(item);
        });

        return result;
    }

    public static fromRawJson(rawJson: any = null): ConnectionInformationItem | null {
        if (!rawJson) {
            return null;
        }

        const instance = new ConnectionInformationItem();

        instance.id = rawJson['id'] || null;
        instance.savePassword = rawJson.hasOwnProperty('savePassword')
            ? <boolean>rawJson['savePassword']
            : false;
        instance.providerName = rawJson['providerName'] || null;
        instance.groupId = rawJson['groupId'] || null;
        instance.options = ConnectionInformationOption.fromRawJson(rawJson['options']);

        return instance;
    }

    public id?: string | null;
    public savePassword: boolean = false;
    public providerName?: string | null;
    public groupId?: string | null;
    public options?: ConnectionInformationOption | null;
}
