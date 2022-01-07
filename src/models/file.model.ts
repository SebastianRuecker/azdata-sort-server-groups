export class File {
    constructor(fileName: string,
                filePath: string,
                content: string) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.content = content;
    }

    public fileName: string = '';
    public filePath: string = '';
    public content: string = '';
}
