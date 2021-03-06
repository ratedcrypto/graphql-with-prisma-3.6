import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Context } from '../../index';

interface SingupArgs {
    credentials: {
        email: string;
        password: string;
    };
    name: string;
    bio: string;
}

interface SigninArgs {
    credentials: {
        email: string;
        password: string;
    };
}

interface UserPayload {
    userErrors: {
        message: string;
    }[];
    token: string | null;
}

const authResolvers = {
    signup: async (
        parent: any,
        { credentials: { email, password }, name, bio }: SingupArgs,
        { prisma }: Context
    ): Promise<UserPayload> => {
        const isEmail = validator.isEmail(email);
        if (!isEmail) {
            return {
                userErrors: [
                    {
                        message: 'Invalid email'
                    }
                ],
                token: null
            };
        }

        const isValidPassword = validator.isLength(password, {
            min: 6
        });

        if (!isValidPassword) {
            return {
                userErrors: [
                    {
                        message: 'Invalid password'
                    }
                ],
                token: null
            };
        }

        if (!name || !bio) {
            return {
                userErrors: [
                    {
                        message: 'Invalid name or bio'
                    }
                ],
                token: null
            };
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword
            }
        });

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        });

        return {
            userErrors: [],
            token: jwt.sign(
                {
                    userId: user.id
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: 3600000
                }
            )
        };
    },
    signin: async (
        parent: any,
        { credentials: { email, password } }: SigninArgs,
        { prisma }: Context
    ): Promise<UserPayload> => {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            return {
                userErrors: [
                    {
                        message: 'Invalid credentials'
                    }
                ],
                token: null
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                userErrors: [
                    {
                        message: 'Invalid credentials'
                    }
                ],
                token: null
            };
        }

        return {
            userErrors: [],
            token: jwt.sign(
                {
                    userId: user.id
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: 3600000
                }
            )
        };
    }
};

export { authResolvers };
