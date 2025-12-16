import type { User} from "../user/userTypes.ts";

export interface Book {
    _id: string;
    title: string;
    author: User;
    genre: string;
    createdAt: Date;
    updatedAt: Date;
}