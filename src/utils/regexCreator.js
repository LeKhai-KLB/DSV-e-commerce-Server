export const ignoreCaseRegex = (string) => {
    return new RegExp(`^${string}`, 'i')
}