export type Topic = {
    id: string;
    title: string;
    content: string;
};

export type TopicWithoutId = Omit<Topic, 'id'>;