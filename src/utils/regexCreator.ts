export const ignoreCaseRegex = (str: string) => {
    return new RegExp(`^${str}`, 'i')
}