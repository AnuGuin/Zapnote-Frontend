export type ContentType =
    | "ARTICLE"
    | "VIDEO"
    | "DOCUMENT"
    | "AUDIO"
    | "SOCIAL POST"
    | "CODE"
    | "IMAGE"
    | "OTHER";

export interface Workspace {
    id: string;
    name: string;
    description?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
