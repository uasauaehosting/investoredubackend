export interface IFeedback {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    rating: number;
    category: 'General' | 'Complaint' | 'Suggestion' | 'Technical Issue' | 'Content Request';
    status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
    response?: string;
    respondedBy?: string;
    respondedAt?: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class FeedbackModel {
    static create(feedbackData: Omit<IFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IFeedback[]>;
    static findById(id: number): Promise<IFeedback | null>;
    static findByStatus(status: string): Promise<IFeedback[]>;
    static findByCategory(category: string): Promise<IFeedback[]>;
    static getPending(): Promise<IFeedback[]>;
    static update(id: number, updateData: Partial<IFeedback>): Promise<boolean>;
    static respondToFeedback(id: number, response: string, respondedBy: string): Promise<boolean>;
    static updateStatus(id: number, status: string): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { FeedbackModel as Feedback };
//# sourceMappingURL=Feedback.d.ts.map