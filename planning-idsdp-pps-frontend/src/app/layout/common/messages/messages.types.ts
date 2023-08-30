export interface Message
{
    id: string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    projectTitleEn?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    read: boolean;
    receiverUserId: number;
}
