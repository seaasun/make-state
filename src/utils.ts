import { v4 as uuidv4 } from 'uuid'

export function getUid(): string {
    return uuidv4()
}
