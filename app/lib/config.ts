import * as fs from 'mz/fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { app } from 'electron'
import writeFileAtomic from 'write-file-atomic'


export function migrateConfig (): void {
    const configPath = path.join(app.getPath('userData'), 'config.yaml')
    const legacyConfigPath = path.join(app.getPath('userData'), '../terminus', 'config.yaml')
    if (fs.existsSync(legacyConfigPath) && (
        !fs.existsSync(configPath) ||
        fs.statSync(configPath).mtime < fs.statSync(legacyConfigPath).mtime
    )) {
        fs.writeFileSync(configPath, fs.readFileSync(legacyConfigPath))
    }
}

export function loadConfig (): any {
    migrateConfig()

    const configPath = path.join(app.getPath('userData'), 'config.yaml')
    if (fs.existsSync(configPath)) {
        return yaml.load(fs.readFileSync(configPath, 'utf8'))
    } else {
        return {}
    }
}

const configPath = path.join(app.getPath('userData'), 'config.yaml')

export async function saveConfig (content: string): Promise<void> {
    await writeFileAtomic(configPath, content, { encoding: 'utf8' })
    await writeFileAtomic(configPath + '.backup', content, { encoding: 'utf8' })
}
