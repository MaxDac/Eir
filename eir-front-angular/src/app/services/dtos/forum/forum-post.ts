interface ForumPost {
  id: number;
  content: string;
  topicId: number;
  creationDate: number;
  user?: User;
}
