export default interface Task {
  id: number;
  columnId: number;
  userId?: number;
  name: string;
  content: string;
  position: number;
  priority: string;
  delivery: Date;
  effort: string;
  impact: string;
}
