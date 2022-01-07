export class ConnectionGroupItem {
    public static fromJsonArray(rawJson: any[] = []): ConnectionGroupItem[] {
        const result: ConnectionGroupItem[] = [];

        if (!rawJson) {
            return result;
        }

        (rawJson || []).forEach((entry) => {
            const item = ConnectionGroupItem.fromRawJson(entry);

            if (!item) {
                return;
            }

            result.push(item);
        });

        return result;
    }

    public static fromRawJson(rawJson: any = null): ConnectionGroupItem | null {
        if (!rawJson) {
            return null;
        }

        const instance = new ConnectionGroupItem();

        instance.id = rawJson['id'] || null;
        instance.parentId = rawJson['parentId'] || null;
        instance.name = rawJson['name'] || '';
        instance.color = rawJson['color'] || null;
        instance.description = rawJson['description'] || null;

        return instance;
    }

    public name: string = '';
    public id?: string | null;
    public parentId?: string | null;
    public color?: string | null;
    public description?: string | null;
}
