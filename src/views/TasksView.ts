import Task from '../models/Task';

export default {
  render(task: Task) {
    return {
      id: task.id,
      columnId: task.columnId,
      name: task.name,
      content: task.content,
      position: task.position,
      priority: task.priority,
      delivery: task.delivery,
      effort: task.effort,
      impact: task.impact,
    };
  },

  renderMany(tasks: Task[]) {
    return tasks.map((task) => this.render(task));
  },
};
