interface ForumTopic {
  id: number;
  title: string;
  description: string;
  sectionId: number;
  creationDate: number;
  posts?: number;
}
