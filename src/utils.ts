let uId: number = 0

export function getUid(): string {
    uId = uId + 1
    return uId.toString()
}
