import {resolve} from 'path';
import {extensions} from 'vscode';
import {existsSync, readFileSync} from 'fs-extra';
import {ILanguagePack} from './models/language-pack.model';

export class Localize {
    private _bundle = this.resolveLanguagePack();
    private _options: { locale: string } = {locale: 'en'};

    public localize(key: string, ...args: string[]): string {
        const message = this._bundle[key] || key;
        return this.format(message, args);
    }

    private init() {
        try {
            this._options = {
                ...this._options,
                ...JSON.parse(process.env.VSCODE_NLS_CONFIG || '{}')
            };
        } catch (err) {
            throw err;
        }
    }

    private format(message: string, args: string[] = []): string {
        return args.length
            ? message.replace(/{(\d+)}/g, (match, rest: any[]) => args[rest[0]] || match)
            : message;
    }

    private resolveLanguagePack(): ILanguagePack {
        this.init();

        const languageFormat = 'package.nls{0}.json';
        const defaultLanguage = languageFormat.replace('{0}', '');

        const extension = extensions.getExtension('SebastianRuecker.azdata-sort-server-groups');

        const rootPath = extension?.extensionPath ?? '';

        const resolvedLanguage = this.recurseCandidates(
            rootPath,
            languageFormat,
            this._options.locale
        );

        const languageFilePath = resolve(rootPath, resolvedLanguage);

        try {
            const defaultLanguageBundle = JSON.parse(
                resolvedLanguage !== defaultLanguage
                    ? readFileSync(resolve(rootPath, defaultLanguage), 'utf-8')
                    : '{}'
            );

            const resolvedLanguageBundle = JSON.parse(
                readFileSync(languageFilePath, 'utf-8')
            );

            return {...defaultLanguageBundle, ...resolvedLanguageBundle};
        } catch (err) {
            throw err;
        }
    }

    private recurseCandidates(
        rootPath: string,
        format: string,
        candidate: string
    ): string {
        const filename = format.replace('{0}', `.${candidate}`);
        const filepath = resolve(rootPath, filename);
        if (existsSync(filepath)) {
            return filename;
        }
        if (candidate.split('-')[0] !== candidate) {
            return this.recurseCandidates(rootPath, format, candidate.split('-')[0]);
        }
        return format.replace('{0}', '');
    }
}

export default Localize.prototype.localize.bind(new Localize());