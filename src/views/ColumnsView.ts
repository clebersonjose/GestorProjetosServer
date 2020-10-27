import Column from '../models/Column';

export default {
  render(column: Column) {
    return {
      id: column.id,
      name: column.name,
      position: column.position,
    };
  },
  renderMany(columns: Column[]) {
    return columns.map((column) => this.render(column));
  },
};
