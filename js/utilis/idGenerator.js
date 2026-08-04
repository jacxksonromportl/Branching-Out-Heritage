export function randomLetters(length = 6) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += letters.charAt(
            Math.floor(Math.random() * letters.length)
        );
    }

    return result;
}

export function generatePublicId(prefix, id) {
    const number = String(id).padStart(5, "0");
    return `${prefix}-${number}-${randomLetters()}`;
}