import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds: number = random(10, 20);
    const salt: string = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password.trim(), salt);
}

export const comparePassword = (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}

export const createToken= (body: any) => {
    return jwt.sign(body, process.env.TOKEN_PASSWORD || 'secret', { expiresIn: '1h'});
}

export const random = (min: number, max: number): number => {
    return Math.floor((Math.random()) * (max-min+1)+min);
}