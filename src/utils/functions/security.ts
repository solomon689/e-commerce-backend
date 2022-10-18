import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds: number = random(10, 20);
    const salt: string = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password.trim(), salt);
}

export const random = (min: number, max: number): number => {
    return Math.floor((Math.random()) * (max-min+1)+min);
}