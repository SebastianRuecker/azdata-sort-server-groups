export class ConnectionInformationOption {
    public static fromRawJson(rawJson: any = null): ConnectionInformationOption | null {
        if (rawJson === null) {
            return null;
        }

        const instance = new ConnectionInformationOption();

        instance.server = rawJson['server'] || null;
        instance.database = rawJson['database'] || null;
        instance.authenticationType = rawJson['authenticationType'] || null;
        instance.user = rawJson['user'] || null;
        instance.password = rawJson['password'] || null;
        instance.applicationName = rawJson['applicationName'] || null;
        instance.databaseDisplayName = rawJson['databaseDisplayName'] || null;
        instance.connectionName = rawJson['connectionName'] || null;

        if (instance.connectionName === null) {
            const database = instance.database || '';
            const server = instance.server || '';

            let fallbackConnectionName = '';
            if (database !== '' && server !== '') {
                fallbackConnectionName = `${database}@${server}`;
            } else {
                if (database !== '') {
                    fallbackConnectionName = database;
                } else {
                    fallbackConnectionName = server;
                }
            }
            instance.connectionName = fallbackConnectionName;
        }

        return instance;
    }

    public server?: string | null;
    public database?: string | null;
    public authenticationType?: string | null;
    public user?: string | null;
    public password?: string | null;
    public applicationName?: string | null;
    public databaseDisplayName?: string | null;
    public connectionName?: string | null;
}
